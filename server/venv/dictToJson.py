import json
def dictToJson(fname, lname, age, feedback):
    user = {
        'first_name' : fname,
        'last_name' : lname,
        'age': age,
        'feedback': feedback
    }

    with open('./user.json', 'w') as output:
        json.dump(user, output)