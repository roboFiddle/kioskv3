import csv
import api.models

FILENAME = "/home/kiosk/kioskv3/roster.csv"
with open(FILENAME) as csv_file:
	reader = csv.reader(csv_file)
	for row in reader:
		name = " ".join(row[0].split(", ")[::-1])
		student_id = row[1]
		grade = row[2]
		privilege_granted = True if int(grade)==12 else False
		pathToImage = ""
		if (len(Student.objects.all().filter(pk=student_id)) == 0):
			models.Student.objects.create(name=name, grade=grade, student_id=student_id,privilege_granted=privilege_granted,pathToImage="")

		else:
			s = Student.objects.all().get(pk=student_id)
			s.name = name
			s.student_id = student_id
			s.grade = grade
			s.privilege_granted = privilege_granted
			s.pathToImage = pathToImage
			s.save()
