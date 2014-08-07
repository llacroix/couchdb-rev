# Couchdb-rev

Keep revisions of your designs synced with your code. Instead
of editing designs directly in the database, edit them in files 
and then process changes to designs and push them to a couchdb
server.

This way, all of your designs will work along the current revision
of your code. When reverting your code, it will also revert the changes 
made to the designs.

All you have to do is

    cdbr --db "project" sync


# Create new revisions

    cdbr create

# List revisions

    cdbr list

