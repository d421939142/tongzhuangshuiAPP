class Task {
  final String id;
  final String customerId;
  final String customerName;
  final String customerPhone;
  final String address;
  final String productBrand;
  final int quantity;
  final double price;
  final String status; // pending, accepted, completed, cancelled
  final DateTime createdAt;
  final DateTime? completedAt;
  final String? notes;
  final int? emptyBottles; // 返回空桶数
  final String? photoUrl; // 签收照片
  
  Task({
    required this.id,
    required this.customerId,
    required this.customerName,
    required this.customerPhone,
    required this.address,
    required this.productBrand,
    required this.quantity,
    required this.price,
    required this.status,
    required this.createdAt,
    this.completedAt,
    this.notes,
    this.emptyBottles,
    this.photoUrl,
  });
  
  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      customerId: json['customerId'],
      customerName: json['customerName'],
      customerPhone: json['customerPhone'],
      address: json['address'],
      productBrand: json['productBrand'],
      quantity: json['quantity'],
      price: (json['price'] as num).toDouble(),
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      completedAt: json['completedAt'] != null ? DateTime.parse(json['completedAt']) : null,
      notes: json['notes'],
      emptyBottles: json['emptyBottles'],
      photoUrl: json['photoUrl'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customerId': customerId,
      'customerName': customerName,
      'customerPhone': customerPhone,
      'address': address,
      'productBrand': productBrand,
      'quantity': quantity,
      'price': price,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'notes': notes,
      'emptyBottles': emptyBottles,
      'photoUrl': photoUrl,
    };
  }
}
