import UIKit
import Flutter

@UIApplicationMain
@objc class GeneratedPluginRegistrant: NSObject {
}

func main() {
  let app = UIApplication.shared
  let principalClassName = NSStringFromClass(GeneratedPluginRegistrant.self)
  let delegateClassName = NSStringFromClass(GeneratedPluginRegistrant.self)
  UIApplicationMain(
    CommandLine.argc,
    CommandLine.unsafeArgv,
    principalClassName,
    delegateClassName
  )
}

override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller = FlutterViewController()
    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.window.rootViewController = controller
    self.window.makeKeyAndVisible()
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}