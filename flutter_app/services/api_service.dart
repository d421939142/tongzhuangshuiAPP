import 'package:dio/dio.dart';
import 'package:get/get.dart' as get_x;
import '../config/app_config.dart';
import 'auth_service.dart';

class ApiService {
  late Dio _dio;
  
  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(milliseconds: AppConfig.connectTimeout),
        receiveTimeout: const Duration(milliseconds: AppConfig.receiveTimeout),
        headers: {
          'Content-Type': 'application/json',
        },
      ),
    );
    
    // 添加拦截器
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          // 添加 token
          try {
            final authService = get_x.Get.find<AuthService>();
            final token = authService.token;
            if (token != null) {
              options.headers['Authorization'] = 'Bearer $token';
            }
          } catch (e) {
            // AuthService 可能未初始化
          }
          return handler.next(options);
        },
        onError: (error, handler) {
          // 错误处理
          if (error.response?.statusCode == 401) {
            // token 过期，退出登录
            try {
              final authService = get_x.Get.find<AuthService>();
              authService.logout();
            } catch (e) {
              // AuthService 可能未初始化
            }
          }
          return handler.next(error);
        },
      ),
    );
  }
  
  /// GET 请求
  Future<dynamic> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      final response = await _dio.get(path, queryParameters: queryParameters);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
  
  /// POST 请求
  Future<dynamic> post(String path, {dynamic data}) async {
    try {
      final response = await _dio.post(path, data: data);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
  
  /// PUT 请求
  Future<dynamic> put(String path, {dynamic data}) async {
    try {
      final response = await _dio.put(path, data: data);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
  
  /// DELETE 请求
  Future<dynamic> delete(String path) async {
    try {
      final response = await _dio.delete(path);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
  
  /// 上传文件
  Future<dynamic> uploadFile(String path, String filePath) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
      });
      final response = await _dio.post(path, data: formData);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
