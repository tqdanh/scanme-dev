class Company {
  Company({this.id, this.name, this.logo, this.address, this.tel, this.email});

  final String id;
  final String name;
  final String logo;
  final String address;
  final String tel;
  final String email;

  factory Company.fromJson(Map<String, dynamic> parsedJson) {
    return Company(
      id: parsedJson['id'],
      name: parsedJson['name'],
      logo: parsedJson['logo'],
      address: parsedJson['address'],
      tel: parsedJson['tel'],
      email: parsedJson['email'],
    );
  }
}
