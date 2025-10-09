import ExpoModulesCore
import GameController
import UIKit

public class ReactNativePhysicalKeyboard: Module {
  private var keyboardShowObserver: NSObjectProtocol?
  private var keyboardHideObserver: NSObjectProtocol?
  private var connectionTime: TimeInterval?
  private var hasHardwareKeyboard = false

  public func definition() -> ModuleDefinition {
    Name("ReactNativePhysicalKeyboard")

    Events("onKeyboardStatusChanged", "onKeyboardInfoChanged")

    OnStartObserving {
      self.setupKeyboardObservers()
      self.checkInitialKeyboardState()
    }

    OnStopObserving {
      self.removeKeyboardObservers()
    }

    Function("hasPhysicalKeyboard") {
      return self.hasHardwareKeyboard
    }

    Function("getPhysicalKeyboardDetails") {
      return self.getPhysicalKeyboardDetails()
    }
  }

  private func setupKeyboardObservers() {
    keyboardShowObserver = NotificationCenter.default.addObserver(
      forName: .GCKeyboardDidConnect,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      guard let self = self else { return }
      if !self.hasHardwareKeyboard {
        self.hasHardwareKeyboard = true
        self.connectionTime = Date().timeIntervalSince1970
        self.sendEvent("onKeyboardStatusChanged", ["isConnected": true])
        self.sendEvent("onKeyboardInfoChanged", ["keyboard": self.getKeyboardDetails()])
      }
    }

    keyboardHideObserver = NotificationCenter.default.addObserver(
      forName: .GCKeyboardDidDisconnect,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      guard let self = self else { return }
      if self.hasHardwareKeyboard {
        self.hasHardwareKeyboard = false
        self.connectionTime = nil
        self.sendEvent("onKeyboardStatusChanged", ["isConnected": false])
      }
    }
  }

  private func removeKeyboardObservers() {
    if let observer = keyboardShowObserver {
      NotificationCenter.default.removeObserver(observer)
    }
    if let observer = keyboardHideObserver {
      NotificationCenter.default.removeObserver(observer)
    }
  }

  private func getKeyboardDetails() -> [String: Any] {
    let keyboard = GCKeyboard.coalesced
    let connectedAtMs = Int((connectionTime ?? Date().timeIntervalSince1970) * 1000)

    let vendorName = keyboard?.vendorName ?? "Unknown"
    let productCategory = keyboard?.productCategory ?? "Keyboard"

    var name = "Hardware Keyboard"
    if let vendor = keyboard?.vendorName, !vendor.isEmpty {
      name = vendor
    }

    let buttonKeys = keyboard?.keyboardInput?.buttons.compactMap { $0.value.sfSymbolsName } ?? []

    return [
      "name": name,
      "connectedAt": connectedAtMs,
      "vendorName": vendorName,
      "productCategory": productCategory,
      "availableButtonKeys": buttonKeys,
      "buttonCount": buttonKeys.count
    ]
  }

  private func getPhysicalKeyboardDetails() -> [String: Any]? {
    return hasHardwareKeyboard ? getKeyboardDetails() : nil
  }

  private func checkInitialKeyboardState() {
    if GCKeyboard.coalesced != nil {
      hasHardwareKeyboard = true
      connectionTime = Date().timeIntervalSince1970
      sendEvent("onKeyboardStatusChanged", ["isConnected": true])
      sendEvent("onKeyboardInfoChanged", ["keyboard": getKeyboardDetails()])
    }
  }
}
