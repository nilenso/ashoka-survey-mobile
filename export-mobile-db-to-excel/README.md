#### Export a Survey Mobile SQLite Database To CSV

- Extract the SQLite database file from the device
- Copy that file into this directory, and name it `database.db`
- On the command-line (from this directory), run:

```bash
$ bundle install
$ bundle exec ruby export.rb
``` 

- A CSV file will be generated for each survey on the device
- These files will be placed in the `output` directory
