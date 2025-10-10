import ExpoModulesCore
import UIKit

class KeyboardCaptureView: UIView {
  var onKeyPress: ((Int, String, Double) -> Void)?

  override var canBecomeFirstResponder: Bool {
    return true
  }

  override func pressesBegan(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
    var handled = false

    for press in presses {
      guard let key = press.key else { continue }

      let keyCode = mapKeyToKeyCode(key: key)
      let timestamp = Date().timeIntervalSince1970 * 1000

      onKeyPress?(keyCode, "down", timestamp)
      handled = true
    }

    if !handled {
      super.pressesBegan(presses, with: event)
    }
  }

  override func pressesEnded(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
    var handled = false

    for press in presses {
      guard let key = press.key else { continue }

      let keyCode = mapKeyToKeyCode(key: key)
      let timestamp = Date().timeIntervalSince1970 * 1000

      onKeyPress?(keyCode, "up", timestamp)
      handled = true
    }

    if !handled {
      super.pressesEnded(presses, with: event)
    }
  }

  override func pressesCancelled(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
    var handled = false

    for press in presses {
      guard let key = press.key else { continue }

      let keyCode = mapKeyToKeyCode(key: key)
      let timestamp = Date().timeIntervalSince1970 * 1000

      onKeyPress?(keyCode, "up", timestamp)
      handled = true
    }

    if !handled {
      super.pressesCancelled(presses, with: event)
    }
  }

  private func mapKeyToKeyCode(key: UIKey) -> Int {
    switch key.keyCode {
    case .keyboardUpArrow: return 126
    case .keyboardDownArrow: return 125
    case .keyboardLeftArrow: return 123
    case .keyboardRightArrow: return 124
    case .keyboardEscape: return 53
    case .keyboardTab: return 48
    case .keyboardReturnOrEnter: return 36
    case .keyboardDeleteOrBackspace: return 51
    case .keyboardSpacebar: return 49
    case .keyboardF1: return 122
    case .keyboardF2: return 120
    case .keyboardF3: return 99
    case .keyboardF4: return 118
    case .keyboardF5: return 96
    case .keyboardF6: return 97
    case .keyboardF7: return 98
    case .keyboardF8: return 100
    case .keyboardF9: return 101
    case .keyboardF10: return 109
    case .keyboardF11: return 103
    case .keyboardF12: return 111
    case .keyboardHome: return 115
    case .keyboardEnd: return 119
    case .keyboardPageUp: return 116
    case .keyboardPageDown: return 121
    default:
      let characters = key.characters
      if let firstChar = characters.first, firstChar.isASCII {
        return Int(firstChar.asciiValue ?? 0)
      }
      return 0
    }
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    if window != nil {
      becomeFirstResponder()
    }
  }

  override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
    let view = super.hitTest(point, with: event)
    if view == self {
      return nil
    }
    return view
  }
}

public class ReactNativePhysicalKeyboardViewManager: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativePhysicalKeyboardView")

    View(ReactNativePhysicalKeyboardView.self) {
      Events("onPhysicalKeyPress")
    }
  }
}

public class ReactNativePhysicalKeyboardView: ExpoView {
  private let keyboardView = KeyboardCaptureView()
  let onPhysicalKeyPress = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    keyboardView.translatesAutoresizingMaskIntoConstraints = false
    addSubview(keyboardView)

    NSLayoutConstraint.activate([
      keyboardView.topAnchor.constraint(equalTo: topAnchor),
      keyboardView.leadingAnchor.constraint(equalTo: leadingAnchor),
      keyboardView.trailingAnchor.constraint(equalTo: trailingAnchor),
      keyboardView.bottomAnchor.constraint(equalTo: bottomAnchor)
    ])

    keyboardView.onKeyPress = { [weak self] keyCode, action, timestamp in
      guard let self = self else { return }
      self.onPhysicalKeyPress([
        "keyCode": keyCode,
        "action": action,
        "timestamp": timestamp
      ])
    }
  }
}
