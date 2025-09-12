Pod::Spec.new do |s|
  s.name           = 'ReactNativePhysicalKeyboard'
  s.version        = '1.0.0'
  s.summary        = 'React Native module for detecting physical keyboards on mobile devices'
  s.description    = 'Cross-platform Expo module that detects physical keyboard connections and provides detailed keyboard information on iOS and Android devices. Uses GameController framework on iOS and InputManager on Android.'
  s.author         = 'arkadiusztw'
  s.homepage       = 'https://github.com/arkadiusztw/react-native-physical-keyboard-detector'
  s.license        = { :type => 'MIT', :file => '../LICENSE' }
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { :git => 'https://github.com/arkadiusztw/react-native-physical-keyboard-detector.git', :tag => "v#{s.version}" }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
