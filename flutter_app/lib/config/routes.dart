import 'package:get/get.dart';
import '../pages/delivery/home_page.dart';
import '../pages/delivery/task_list_page.dart';
import '../pages/auth/login_page.dart';
import '../pages/admin/admin_home_page.dart';
import '../main.dart';

class AppRoutes {
  static const String splash = '/splash';
  static const String login = '/login';
  static const String deliveryHome = '/delivery/home';
  static const String deliveryTaskList = '/delivery/tasks';
  static const String deliveryTaskDetail = '/delivery/task-detail';
  static const String deliveryCheckIn = '/delivery/check-in';
  static const String adminHome = '/admin/home';
  static const String adminTaskCreate = '/admin/task-create';
  static const String adminStats = '/admin/stats';
  
  static final List<GetPage> routes = [
    GetPage(
      name: splash,
      page: () => const SplashScreen(),
    ),
    // 登录路由
    GetPage(
      name: login,
      page: () => const LoginPage(),
    ),
    // 送水工路由
    GetPage(
      name: deliveryHome,
      page: () => const DeliveryHomePage(),
    ),
    GetPage(
      name: deliveryTaskList,
      page: () => const TaskListPage(),
    ),
    GetPage(
      name: deliveryTaskDetail,
      page: () => const TaskListPage(), // 临时使用
    ),
    GetPage(
      name: deliveryCheckIn,
      page: () => const TaskListPage(), // 临时使用
    ),
    // 管理员路由
    GetPage(
      name: adminHome,
      page: () => const AdminHomePage(),
    ),
    GetPage(
      name: adminTaskCreate,
      page: () => const AdminHomePage(), // 临时使用
    ),
    GetPage(
      name: adminStats,
      page: () => const AdminHomePage(), // 临时使用
    ),
  ];
}
