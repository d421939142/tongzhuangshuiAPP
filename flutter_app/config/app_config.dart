class AppConfig {
  // =====================================================
  // 🔧 服务器配置
  // =====================================================
  static const String _serverIp = '43.138.207.105'; // 腾讯云服务器IP
  static const int _serverPort = 3000;

  // API 基础地址
  static const String apiBaseUrl = 'http://$_serverIp:$_serverPort/api';

  // 本地测试时使用（手机和电脑在同一个 WiFi 下）
  // static const String apiBaseUrl = 'http://192.168.x.x:3000/api';

  // 默认配置
  static const int connectTimeout = 10000; // ms
  static const int receiveTimeout = 10000; // ms

  // 功能开关
  static const bool enableLocationService = true;
  static const bool enableOfflineMode = true;
  static const bool enableVoiceInput = true;

  // 应用信息
  static const String appName = '桶装水配送管理';
  static const String appVersion = '1.0.0';
}
