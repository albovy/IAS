let res = [
  db.users.drop(),
  db.users.insert({username: "ias_user", password: "ias_password"}),
]
