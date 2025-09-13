import ExpoModulesCore
import GameController
import os.log

public class ReactNativePhysicalKeyboard: Module {
  private var keyboardObserver: NSObjectProtocol?
  private var disconnectObserver: NSObjectProtocol?
  private var connectionTime: TimeInterval?
  private var keyboard: GCKeyboard?
  private let logger = Logger(subsystem: "com.ReactNativePhysicalKeyboard", category: "keyboard")
  
  public func definition() -> ModuleDefinition {
    Name("ReactNativePhysicalKeyboard")
    
    Events("onKeyboardStatusChanged", "onKeyboardInfoChanged", "onKeyPress")
    
    OnStartObserving {
      self.setupKeyboardObservers()
      self.checkInitialKeyboardState()
    }
    
    OnStopObserving {
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
    ) { notification in
      if let keyboard = notification.object as? GCKeyboard {
        self.keyboard = keyboard
        self.setupKeyInputHandler(for: keyboard)
      }
      self.connectionTime = Date().timeIntervalSince1970
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
      self.stopKeyListener()
      self.connectionTime = nil
      self.sendEvent("onKeyboardStatusChanged", ["isConnected": false])
      self.sendEvent("onKeyboardInfoChanged", ["keyboard": nil])
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
    
    let connectedAtMs = Int((connectionTime ?? Date().timeIntervalSince1970) * 1000)
    
    let details: [String: Any] = [
      "name": getKeyboardName(keyboard),
      "connectedAt": connectedAtMs,
      "vendorName": keyboard.vendorName,
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
    do {
      let physicalInput = keyboard.physicalInputProfile
      return physicalInput.buttons.count
    } catch {
      logger.error("Error getting button count: \(error)")
      return 0
    }
  }
  
  private func checkInitialKeyboardState() {
    if GCKeyboard.coalesced != nil {
      keyboard = GCKeyboard.coalesced
      connectionTime = Date().timeIntervalSince1970
      
      sendEvent("onKeyboardStatusChanged", ["isConnected": true])
      if let keyboardDetails = getPhysicalKeyboardDetails() {
        sendEvent("onKeyboardInfoChanged", ["keyboard": keyboardDetails])
      }
      if let keyboard = keyboard {
        setupKeyInputHandler(for: keyboard)
      }
    }
  }
  
  private func setupKeyInputHandler(for keyboard: GCKeyboard) {
    if let input = keyboard.keyboardInput {
      input.keyChangedHandler = { [weak self] _, key, keyCode, pressed in
        if pressed {
          self?.handleKeyEvent(keyCode: keyCode)
        }
      }
    }
  }
  
  private func handleKeyEvent(keyCode: GCKeyCode) {
    let payload: [String: Any] = [
      "keyCode": keyCode.rawValue,
      "timestamp": Date().timeIntervalSince1970 * 1000
    ]
    sendEvent("onKeyPress", payload)
  }
  
  private func stopKeyListener() {
    if let input = keyboard?.keyboardInput {
      input.keyChangedHandler = nil
    }
    keyboard = nil
  }

}