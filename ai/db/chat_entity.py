from peewee import CharField, TextField, SQL, Model

# Define the model
class ChatEntity(Model):
    guild_id = CharField(null=True)
    user_id = CharField()
    question = TextField()
    answer = TextField()

    class Meta:
        table_name = 'chat'
        primary_key = False


ChatEntity.add_index(SQL(f"create unique index on {ChatEntity._meta.table_name}(guild_id, user_id) NULLS NOT DISTINCT;"))

