from django.db import models


class Login(models.Model):
    name = models.CharField(max_length=10)
    email = models.CharField(max_length=15)
    password = models.CharField(max_length=20, null=True)
    mobile = models.CharField(max_length=15)
    temp_password = models.CharField(max_length=10, null=True)

    def __str__(self):
        return str({
            'email': self.email,
            'username': self.name,
            'id': self.id,
        })


class Event(models.Model):
    event_name = models.CharField(max_length=25)
    event_venue = models.CharField(max_length=25)
    event_date = models.DateField(default=None)
    event_time = models.TimeField(default=None)
    event_description = models.CharField(max_length=100)
    event_admin = models.CharField(max_length=50)
    event_link = models.URLField()

    def __str__(self):
        return self.event_name + " on " + str(self.event_date)


class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=40)
    payment_amount = models.CharField(max_length=5)
    payment_ref = models.CharField(max_length=10)
    num_guests = models.IntegerField(default=1)
    num_days = models.IntegerField(default=2)
    mode_of_travel = models.CharField(max_length=5)
    arrival_date = models.DateField(default=None)
    arrival_time = models.TimeField(default=None)
    departure_date = models.DateField(default=None)
    pickup = models.CharField(max_length=5)
    is_deleted = models.CharField(max_length=3, default='No')

    def __str__(self):
        return str(self.attributes())

    def attributes(self):
        return {
            'event': self.event.event_name,
            'name': self.name,
            'payment_amount': self.payment_amount,
            'payment_ref': self.payment_ref,
            'num_guests': str(self.num_guests),
            'num_days': str(self.num_days),
            'mode_of_travel': self.mode_of_travel,
            'arrival_date': str(self.arrival_date),
            'arrival_time': str(self.arrival_time),
            'departure_date': str(self.departure_date),
            'pickup': self.pickup,
        }


class File_uploads(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    file_url = models.FileField(upload_to='media/', default=None)

    def __str__(self):
        return str(self.file_url)


class Password(models.Model):
    password = models.CharField(max_length=20)


class Programme(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    date = models.DateField(default=None)
    time = models.TimeField(default=None)
    title = models.CharField(default=None, max_length=50)
    speaker = models.CharField(default=None, max_length=50)
    presenter = models.CharField(default=None, max_length=50)



