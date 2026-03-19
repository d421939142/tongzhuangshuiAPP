import 'package:shared_preferences/shared_preferences.dart';
import 'package:get/get.dart';

class AuthService extends GetxService {
  final SharedPreferences _prefs;
  
  late Rx<String?> _token;
  late Rx<String?> _userId;
  late Rx<String?> _userName;
  late Rx<String?> _userRole;
  
  AuthService(this._prefs);
  
  bool get isLoggedIn => _token.value != null;
  String? get token => _token.value;
  String? get userId => _userId.value;
  String? get userName => _userName.value;
  String? get userRole => _userRole.value;
  
  @override
  void onInit() {
    super.onInit();
    _token = Rx(_prefs.getString('token'));
    _userId = Rx(_prefs.getString('userId'));
    _userName = Rx(_prefs.getString('userName'));
    _userRole = Rx(_prefs.getString('userRole'));
  }
  
  /// 登录
  Future<bool> login(String phone, String password) async {
    try {
      // TODO: 调用 API 登录
      // final response = await http.post('/login', data: {...});
      
      // 模拟登录成功
      final token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
      final userId = 'user_123';
      final userName = phone;
      final userRole = 'delivery'; // delivery 或 admin
      
      _token.value = token;
      _userId.value = userId;
      _userName.value = userName;
      _userRole.value = userRole;
      
      await _prefs.setString('token', token);
      await _prefs.setString('userId', userId);
      await _prefs.setString('userName', userName);
      await _prefs.setString('userRole', userRole);
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /// 登出
  Future<void> logout() async {
    _token.value = null;
    _userId.value = null;
    _userName.value = null;
    _userRole.value = null;
    
    await _prefs.remove('token');
    await _prefs.remove('userId');
    await _prefs.remove('userName');
    await _prefs.remove('userRole');
  }
}
