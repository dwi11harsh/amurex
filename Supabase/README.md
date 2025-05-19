# README for Setting Up Supabase Database for Local Testing

This README provides instructions on how to set up a Supabase database for local testing using a series of SQL queries. Each query is contained in a separate file, which you can run in your SQL editor to create the necessary database structure and populate it with sample data.

## Queries Files

1. **01_enable_extensions.sql**  
   This file contains queries to enable necessary extensions for the database.

2. **02_create_tables.sql**  
   This file contains queries to create the required tables for users, documents, teams, and more.

3. **03_create_triggers_and_functions.sql**  
   This file contains queries to create triggers and functions for managing timestamps and handling new users.

4. **04_insert_sample_data.sql**  
   This file contains queries to insert sample data into the database for testing purposes.

## Steps to Set Up Supabase

Follow these steps to create a Supabase account and set up your database:

1. **Create a Supabase Account**

   - Go to [Supabase](https://supabase.com/).
   - Click on "Start your project" and sign up for a new account using your email or GitHub account.

2. **Create a New Project**

   - After logging in, click on "New Project."
   - Fill in the project details, including the project name, password, and database region.
   - Click "Create new project."

3. **Access the SQL Editor**

   - Once your project is created, navigate to the "SQL Editor" from the left sidebar.

4. **Run the Queries**

   - Open each of the SQL files listed above in your preferred text editor.
   - Copy the contents of each file and paste them into the SQL Editor in Supabase.
   - Execute the queries in the following order:
     1. `01_enable_extensions.sql`
     2. `02_create_tables.sql`
     3. `03_create_triggers_and_functions.sql`
     4. `04_insert_sample_data.sql`

5. **Verify the Setup**
   - After running the queries, you can check the "Table Editor" in Supabase to verify that the tables have been created and populated with sample data.

## Conclusion

You now have a Supabase database set up for local testing. You can use this database to test your application and experiment with the data structure. If you have any questions or need further assistance, feel free to reach out to the Supabase community or consult the documentation.

**05_alter_table.sql** & **06_add_data_into_altered_table** were later created for testing /api/cron/google-import
