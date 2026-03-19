import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../config/theme.dart';
import '../../models/task_model.dart';

class TaskListPage extends StatefulWidget {
  const TaskListPage({Key? key}) : super(key: key);

  @override
  State<TaskListPage> createState() => _TaskListPageState();
}

class _TaskListPageState extends State<TaskListPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final List<Task> _tasks = [
    Task(
      id: '1',
      customerId: 'cust_001',
      customerName: '李四',
      customerPhone: '13911111111',
      address: '中关村大街 1 号',
      productBrand: '康师傅 18.9L',
      quantity: 2,
      status: 'pending',
      price: 35,
      createdAt: DateTime.now(),
    ),
    Task(
      id: '2',
      customerId: 'cust_002',
      customerName: '王五',
      customerPhone: '13922222222',
      address: '朝阳公园 2 号楼',
      productBrand: '怡宝 12L',
      quantity: 1,
      status: 'accepted',
      price: 20,
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
    ),
    Task(
      id: '3',
      customerId: 'cust_003',
      customerName: '张三',
      customerPhone: '13933333333',
      address: '国贸中心 3 层',
      productBrand: '农夫山泉 18.9L',
      quantity: 5,
      status: 'completed',
      price: 180,
      createdAt: DateTime.now().subtract(const Duration(hours: 3)),
      completedAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    Task(
      id: '4',
      customerId: 'cust_004',
      customerName: '赵六',
      customerPhone: '13944444444',
      address: '望京 5 号小区',
      productBrand: '康师傅 18.9L',
      quantity: 3,
      status: 'pending',
      price: 105,
      createdAt: DateTime.now(),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Task> _getFilteredTasks() {
    final index = _tabController.index;
    if (index == 0) return _tasks;
    if (index == 1) return _tasks.where((t) => t.status == 'pending').toList();
    if (index == 2) return _tasks.where((t) => t.status == 'accepted').toList();
    return _tasks.where((t) => t.status == 'completed').toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('配送任务'),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          onTap: (_) => setState(() {}),
          tabs: const [
            Tab(text: '全部', icon: Icon(Icons.list)),
            Tab(text: '待接单', icon: Icon(Icons.schedule)),
            Tab(text: '进行中', icon: Icon(Icons.local_shipping)),
          ],
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: _getFilteredTasks().length,
        itemBuilder: (context, index) {
          final task = _getFilteredTasks()[index];
          return TaskCard(
            task: task,
            onTap: () => Get.toNamed(
              '/delivery/task-detail',
              arguments: {'taskId': task.id},
            ),
          );
        },
      ),
    );
  }
}

class TaskCard extends StatelessWidget {
  final Task task;
  final VoidCallback onTap;

  const TaskCard({
    required this.task,
    required this.onTap,
    Key? key,
  }) : super(key: key);

  Color _getStatusColor() {
    switch (task.status) {
      case 'pending':
        return AppTheme.warningColor;
      case 'accepted':
        return AppTheme.primaryColor;
      case 'completed':
        return AppTheme.successColor;
      default:
        return Colors.grey;
    }
  }

  String _getStatusText() {
    switch (task.status) {
      case 'pending':
        return '待接单';
      case 'accepted':
        return '进行中';
      case 'completed':
        return '已完成';
      default:
        return '未知';
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        margin: const EdgeInsets.only(bottom: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 顶部：姓名和状态
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          task.customerName,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          task.address,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _getStatusText(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // 产品和数量
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Icon(Icons.local_drink, color: Colors.blue[300]),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            task.productBrand,
                            style: const TextStyle(fontSize: 14),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    'x${task.quantity}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // 底部：价格和时间
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 14, color: Colors.grey[500]),
                      const SizedBox(width: 4),
                      Text(
                        _formatTime(task.createdAt),
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  Text(
                    '¥${task.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFF6B6B),
                    ),
                  ),
                ],
              ),
              
              // 操作按钮
              if (task.status == 'pending')
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        '接单',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final diff = now.difference(time);

    if (diff.inMinutes < 1) {
      return '刚刚';
    } else if (diff.inMinutes < 60) {
      return '${diff.inMinutes}分钟前';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}小时前';
    } else {
      return '${time.month}-${time.day} ${time.hour}:${time.minute.toString().padLeft(2, '0')}';
    }
  }
}
