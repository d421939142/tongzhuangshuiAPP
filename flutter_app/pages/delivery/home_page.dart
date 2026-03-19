import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../config/theme.dart';

class DeliveryHomePage extends StatelessWidget {
  const DeliveryHomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('送水工首页'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 统计卡片
            Container(
              padding: const EdgeInsets.all(16),
              color: AppTheme.backgroundColor,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _StatCard(
                    title: '待接单',
                    value: '5',
                    color: AppTheme.primaryColor,
                  ),
                  _StatCard(
                    title: '进行中',
                    value: '2',
                    color: AppTheme.warningColor,
                  ),
                  _StatCard(
                    title: '已完成',
                    value: '12',
                    color: AppTheme.successColor,
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 20),
            
            // 快速入口
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '快速入口',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _QuickButton(
                        icon: Icons.list,
                        label: '任务列表',
                        onTap: () => Get.toNamed('/delivery/tasks'),
                      ),
                      _QuickButton(
                        icon: Icons.location_on,
                        label: '地址导航',
                        onTap: () {},
                      ),
                      _QuickButton(
                        icon: Icons.camera_alt,
                        label: '拍照签收',
                        onTap: () {},
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),
            
            // 最近任务
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '最近任务',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 12),
                  _TaskCard(
                    customerName: '李四',
                    address: 'xx 小区 x 号楼 xx 室',
                    product: '康师傅 18.9L',
                    status: 'pending',
                  ),
                  _TaskCard(
                    customerName: '王五',
                    address: 'xx 公司 x 楼',
                    product: '怡宝 12L',
                    status: 'accepted',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          title,
          style: const TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}

class _QuickButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppTheme.backgroundColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppTheme.primaryColor, size: 32),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  final String customerName;
  final String address;
  final String product;
  final String status;

  const _TaskCard({
    required this.customerName,
    required this.address,
    required this.product,
    required this.status,
  });

  Color _getStatusColor() {
    if (status == 'pending') return AppTheme.warningColor;
    if (status == 'accepted') return AppTheme.primaryColor;
    return AppTheme.successColor;
  }

  String _getStatusText() {
    if (status == 'pending') return '待接单';
    if (status == 'accepted') return '进行中';
    return '已完成';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  customerName,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    _getStatusText(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              address,
              style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 4),
            Text(
              product,
              style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
      ),
    );
  }
}
