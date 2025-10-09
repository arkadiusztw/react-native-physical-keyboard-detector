package expo.modules.physicalkeyboard

import android.content.Context
import android.hardware.input.InputManager
import android.os.Bundle
import android.util.Log
import android.view.InputDevice
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ReactNativePhysicalKeyboard : Module(), InputManager.InputDeviceListener {

  private companion object {
    private const val TAG = "PhysicalKeyboard"
  }

  private val context: Context
    get() = appContext.reactContext ?: throw Exception("React context not available")

  private val inputManager: InputManager
    get() = context.getSystemService(Context.INPUT_SERVICE) as InputManager

  @Volatile private var isListening = false
  private var connectionTime: Long? = null

  override fun definition() = ModuleDefinition {
    Name("ReactNativePhysicalKeyboard")

    Events("onKeyboardStatusChanged", "onKeyboardInfoChanged", "onKeyPress")

    OnStartObserving {
      startInputDeviceListening()
      checkInitialKeyboardState()
    }

    OnStopObserving { stopInputDeviceListening() }

    Function("hasPhysicalKeyboard") {
      return@Function hasPhysicalKeyboard()
    }

    Function("getPhysicalKeyboardDetails") {
      return@Function getPhysicalKeyboardDetails()
    }

  }

  private fun startInputDeviceListening() {
    synchronized(this) {
      if (!isListening) {
        try {
          inputManager.registerInputDeviceListener(this, null)
          isListening = true
        } catch (e: Exception) {
          Log.w(TAG, "Error starting input device listening", e)
        }
      }
    }
  }

  private fun stopInputDeviceListening() {
    synchronized(this) {
      if (isListening) {
        try {
          inputManager.unregisterInputDeviceListener(this)
          isListening = false
        } catch (e: Exception) {
          Log.w(TAG, "Error stopping input device listening", e)
        }
      }
    }
  }

  override fun onInputDeviceAdded(deviceId: Int) {
    try {
      val device = InputDevice.getDevice(deviceId)
      if (device != null && isPhysicalKeyboard(device)) {
        connectionTime = System.currentTimeMillis()
        sendEvent("onKeyboardStatusChanged", bundleOf("isConnected" to true))
        getPhysicalKeyboardDetails()?.let { details ->
          sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to details))
        }
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error handling input device added", e)
    }
  }

  override fun onInputDeviceRemoved(deviceId: Int) {
    try {
      val hasKeyboards = hasPhysicalKeyboard()

      if (!hasKeyboards) {
        connectionTime = null
      }

      sendEvent("onKeyboardStatusChanged", bundleOf("isConnected" to hasKeyboards))

      if (hasKeyboards) {
        getPhysicalKeyboardDetails()?.let { details ->
          sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to details))
        }
      } else {
        sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to null))
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error handling input device removed", e)
    }
  }

  override fun onInputDeviceChanged(deviceId: Int) {
    try {
      val device = InputDevice.getDevice(deviceId)
      if (device != null && isPhysicalKeyboard(device)) {
        getPhysicalKeyboardDetails()?.let { details ->
          sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to details))
        }
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error handling input device changed", e)
    }
  }

  private fun hasPhysicalKeyboard(): Boolean {
    return getPhysicalKeyboards().isNotEmpty()
  }

  private fun getPhysicalKeyboardDetails(): Bundle? {
    val keyboards = getPhysicalKeyboards()
    if (keyboards.isEmpty()) return null

    val device = keyboards.first()
    val connectedAtMs = connectionTime ?: System.currentTimeMillis()

    return bundleOf(
            "name" to (device.name ?: "Unknown Keyboard"),
            "connectedAt" to connectedAtMs,
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
    return try {
      val keyboards = mutableListOf<InputDevice>()

      inputManager.inputDeviceIds.forEach { deviceId ->
        try {
          val device = InputDevice.getDevice(deviceId)
          if (device != null && isPhysicalKeyboard(device)) {
            keyboards.add(device)
          }
        } catch (e: Exception) {
          Log.w(TAG, "Error getting input device $deviceId", e)
        }
      }

      keyboards
    } catch (e: Exception) {
      Log.e(TAG, "Error getting physical keyboards", e)
      emptyList()
    }
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

  private fun checkInitialKeyboardState() {
    try {
      val hasKeyboards = hasPhysicalKeyboard()
      if (hasKeyboards) {
        connectionTime = System.currentTimeMillis()
        sendEvent("onKeyboardStatusChanged", bundleOf("isConnected" to true))
        getPhysicalKeyboardDetails()?.let { details ->
          sendEvent("onKeyboardInfoChanged", bundleOf("keyboard" to details))
        }
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error checking initial keyboard state", e)
    }
  }
}
