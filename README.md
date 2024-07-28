# DeezNotes
A Notes App made with Express, MongoDB, EJS and custom Authentication using JWT.

## What It Does?
1. Custom User Authentication using JWT
2. Notes are either public or private, with the added compelxity of ```Edit Access``` to other Users.
3. One can share thier private and public notes with other users, they also have the feature to revoke this access.
4. The notes are protected so that only those who has Authority to view them can view them and only those who can edit them, can do that.
5. Only the creator of the Note can delete it, and provide (and revoke) others its edit and view access.

#### Further Dev
I want to add pagination in the ```Home``` and ```Notes``` Routes (might add later), Also wanna add good looking custom errror pages (I suck at UI) and maybe even use express-flash for flashing messages.
Also, i might remake this whole EJS frontend in React one day ;}.


P.S. Maybe one or two routes might be broken as i've not tested each and every case at each and every route (there were a lot :( ).
