package expo.modules.physicalkeyboard

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ReactNativePhysicalKeyboardViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ReactNativePhysicalKeyboardView")
    
    View(ReactNativePhysicalKeyboardView::class) {
      Events("onPhysicalKeyPress")
    }
  }
}