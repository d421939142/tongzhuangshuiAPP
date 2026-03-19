class Customer {
  final String id;
  final String name;
  final String phone;
  final String type; // residential, commercial, casual
  final String status; // active, inactive
  final List<String> addresses;
  final String? defaultAddressId;
  final int? bottleDebt; // 欠桶数
  final int? tickets; // 水票数
  final DateTime createdAt;
  final DateTime? lastOrderAt;
  
  Customer({
    required this.id,
    required this.name,
    required this.phone,
    required this.type,
    required this.status,
    required this.addresses,
    this.defaultAddressId,
    this.bottleDebt,
    this.tickets,
    required this.createdAt,
    this.lastOrderAt,
  });
  
  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id'],
      name: json['name'],
      phone: json['phone'],
      type: json['type'],
      status: json['status'],
      addresses: List<String>.from(json['addresses'] ?? []),
      defaultAddressId: json['defaultAddressId'],
      bottleDebt: json['bottleDebt'],
      tickets: json['tickets'],
      createdAt: DateTime.parse(json['createdAt']),
      lastOrderAt: json['lastOrderAt'] != null ? DateTime.parse(json['lastOrderAt']) : null,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'type': type,
      'status': status,
      'addresses': addresses,
      'defaultAddressId': defaultAddressId,
      'bottleDebt': bottleDebt,
      'tickets': tickets,
      'createdAt': createdAt.toIso8601String(),
      'lastOrderAt': lastOrderAt?.toIso8601String(),
    };
  }
}
