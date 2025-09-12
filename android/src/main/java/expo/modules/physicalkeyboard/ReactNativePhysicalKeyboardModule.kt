package expo.modules.physicalkeyboard

import android.content.Context
import android.hardware.input.InputManager
import android.os.Bundle
import android.view.InputDevice
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ReactNativePhysicalKeyboard : Module(), InputManager.InputDeviceListener {

  private val context: Context
    get() = appContext.reactContext ?: throw Exception("React context not available")

  private val inputManager: InputManager
    get() = context.getSystemService(Context.INPUT_SERVICE) as InputManager

  private var isListening = false

  override fun definition() = ModuleDefinition {
    Name("ReactNativePhysicalKeyboard")

    Events("onKeyboardStatusChanged", "onKeyboardInfoChanged")

    OnCreate { startInputDeviceListening() }

    OnDestroy { stopInputDeviceListening() }

    Function("hasPhysicalKeyboard") {
      return@Function hasPhysicalKeyboard()
    }

    Function("getPhysicalKeyboardDetails") {
      return@Function getPhysicalKeyboardDetails()
    }
  }

  private fun startInputDeviceListening() {
    if (!isListening) {
      inputManager.registerInputDeviceListener(this, null)
      isListening = true
    }
  }

  private fun stopInputDeviceListening() {
    if (isListening) {
      inputManager.unregisterInputDeviceListener(this)
      isListening = false
    }
  }

  override fun onInputDeviceAdded(deviceId: Int) {
    val device = InputDevice.getDevice(deviceId)
    if (device != null && isPhysicalKeyboard(device)) {
      sendEvent("onKeyboardStatusChanged", bundleOf("isConnected" to true))
      getPhysicalKeyboardDetails()?.let { details ->
        sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to details))
      }
    }
  }

  override fun onInputDeviceRemoved(deviceId: Int) {

    val hasKeyboards = hasPhysicalKeyboard()
    sendEvent("onKeyboardStatusChanged", bundleOf("isConnected" to hasKeyboards))

    if (hasKeyboards) {
      getPhysicalKeyboardDetails()?.let { details ->
        sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to details))
      }
    } else {
      sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to null))
    }
  }

  override fun onInputDeviceChanged(deviceId: Int) {
    val device = InputDevice.getDevice(deviceId)
    if (device != null && isPhysicalKeyboard(device)) {
      getPhysicalKeyboardDetails()?.let { details ->
        sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to details))
      }
    }
  }

  private fun hasPhysicalKeyboard(): Boolean {
    return getPhysicalKeyboards().isNotEmpty()
  }

  private fun getPhysicalKeyboardDetails(): Bundle? {
    val keyboards = getPhysicalKeyboards()
    if (keyboards.isEmpty()) return null

    val device = keyboards.first()

    return bundleOf(
            "name" to (device.name ?: "Unknown Keyboard"),
            "connectedAt" to System.currentTimeMillis(),
            "id" to device.id,
            "vendorId" to device.vendorId,
            "productId" to device.productId,
            "controllerNumber" to device.controllerNumber,
            "descriptor" to device.descriptor,
            "isVirtual" to device.isVirtual,
            "isExternal" to device.isExternal,
            "sources" to device.sources,
            "keyboardType" to device.keyboardType,
            "keyboardTypeName" to getKeyboardTypeName(device.keyboardType)
    )
  }

  private fun getPhysicalKeyboards(): List<InputDevice> {
    val keyboards = mutableListOf<InputDevice>()

    inputManager.inputDeviceIds.forEach { deviceId ->
      val device = InputDevice.getDevice(deviceId)
      if (device != null && isPhysicalKeyboard(device)) {
        keyboards.add(device)
      }
    }

    return keyboards
  }

  private fun isPhysicalKeyboard(device: InputDevice): Boolean {
    return device.sources and InputDevice.SOURCE_KEYBOARD == InputDevice.SOURCE_KEYBOARD &&
            !device.isVirtual &&
            device.keyboardType == InputDevice.KEYBOARD_TYPE_ALPHABETIC
  }

  private fun getKeyboardTypeName(keyboardType: Int): String {
    return when (keyboardType) {
      InputDevice.KEYBOARD_TYPE_ALPHABETIC -> "ALPHABETIC"
      InputDevice.KEYBOARD_TYPE_NON_ALPHABETIC -> "NON_ALPHABETIC"
      InputDevice.KEYBOARD_TYPE_NONE -> "NONE"
      else -> "UNKNOWN"
    }
  }
}
