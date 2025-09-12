import ExpoModulesCore
import GameController

public class ReactNativePhysicalKeyboard: Module {
  private var keyboardObserver: NSObjectProtocol?
  private var disconnectObserver: NSObjectProtocol?
  
  public func definition() -> ModuleDefinition {
    Name("ReactNativePhysicalKeyboard")
    
    Events("onKeyboardStatusChanged", "onKeyboardInfoChanged")
    
    OnCreate {
      self.setupKeyboardObservers()
    }
    
    OnDestroy {
      self.removeKeyboardObservers()
    }
    
    Function("hasPhysicalKeyboard") {
      return self.hasPhysicalKeyboard()
    }
    
    Function("getPhysicalKeyboardDetails") {
      return self.getPhysicalKeyboardDetails()
    }
  }
  
  private func setupKeyboardObservers() {
    keyboardObserver = NotificationCenter.default.addObserver(
      forName: .GCKeyboardDidConnect,
      object: nil,
      queue: .main
    ) { _ in
      self.sendEvent("onKeyboardStatusChanged", ["isConnected": true])
      if let keyboardDetails = self.getPhysicalKeyboardDetails() {
        self.sendEvent("onKeyboardInfoChanged", ["keyboard": keyboardDetails])
      }
    }
    
    disconnectObserver = NotificationCenter.default.addObserver(
      forName: .GCKeyboardDidDisconnect,
      object: nil,
      queue: .main
    ) { _ in
      self.sendEvent("onKeyboardStatusChanged", ["isConnected": false])
      self.sendEvent("onKeyboardInfoChanged", ["keyboard": NSNull()])
    }
  }
  
  private func removeKeyboardObservers() {
    if let observer = keyboardObserver {
      NotificationCenter.default.removeObserver(observer)
    }
    if let observer = disconnectObserver {
      NotificationCenter.default.removeObserver(observer)
    }
  }
  
  private func hasPhysicalKeyboard() -> Bool {
    return GCKeyboard.coalesced != nil
  }
  
  private func getPhysicalKeyboardDetails() -> [String: Any]? {
    guard let keyboard = GCKeyboard.coalesced else { return nil }
    
    let details: [String: Any] = [
      "name": getKeyboardName(keyboard),
      "connectedAt": Int(Date().timeIntervalSince1970 * 1000),
      "vendorName": keyboard.vendorName ?? NSNull(),
      "productCategory": keyboard.productCategory,
      "availableButtonKeys": getAvailableButtonKeys(keyboard),
      "buttonCount": getButtonCount(keyboard)
    ]
    
    return details
  }
  
  private func getKeyboardName(_ keyboard: GCKeyboard) -> String {
    return keyboard.vendorName ?? "Physical Keyboard"
  }
  
  private func getAvailableButtonKeys(_ keyboard: GCKeyboard) -> [String] {
    let physicalInput = keyboard.physicalInputProfile
    let buttonNames = Array(physicalInput.buttons.keys).sorted()
    return buttonNames
  }
  
  private func getButtonCount(_ keyboard: GCKeyboard) -> Int {
    let physicalInput = keyboard.physicalInputProfile
    return physicalInput.buttons.count
  }
  
}