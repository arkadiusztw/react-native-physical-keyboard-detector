package expo.modules.physicalkeyboard

import android.content.Context
import android.view.InputDevice
import android.view.KeyEvent
import android.view.View
import android.view.ViewGroup
import android.os.Bundle
import androidx.core.os.bundleOf
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.viewevent.ViewEventCallback
import expo.modules.kotlin.views.ExpoView

class ReactNativePhysicalKeyboardView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {

  val onPhysicalKeyPress by EventDispatcher<Bundle>()
  
  init {
    isFocusable = true
    isFocusableInTouchMode = true
    requestFocus()
    
    layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    )
  }
  
  override fun dispatchKeyEvent(event: KeyEvent): Boolean {
    event.let {
      if (it.device != null && isPhysicalKeyboard(it.device)) {
        when (it.action) {
          KeyEvent.ACTION_DOWN -> {
            onPhysicalKeyPress(bundleOf(
              "keyCode" to it.keyCode,
              "action" to "down",
              "timestamp" to System.currentTimeMillis()
            ))
          }
          KeyEvent.ACTION_UP -> {
            onPhysicalKeyPress(bundleOf(
              "keyCode" to it.keyCode,
              "action" to "up",
              "timestamp" to System.currentTimeMillis()
            ))
          }
        }
      }
    }
    return super.dispatchKeyEvent(event)
  }
  
  private fun isPhysicalKeyboard(device: InputDevice): Boolean {
    return device.sources and InputDevice.SOURCE_KEYBOARD == InputDevice.SOURCE_KEYBOARD &&
            !device.isVirtual &&
            device.keyboardType == InputDevice.KEYBOARD_TYPE_ALPHABETIC
  }
}

