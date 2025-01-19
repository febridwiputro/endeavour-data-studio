import psycopg2
from sqlalchemy import create_engine, text
from config import settings
from sqlalchemy.exc import OperationalError

# Database connection settings
DATABASE_URL = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.DATABASE_PORT}/{settings.POSTGRES_DB}"

def reset_database():
    try:
        # Reset schema using SQLAlchemy
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            # Check if the public schema exists
            schema_exists_query = text(
                "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'public';"
            )
            result = connection.execute(schema_exists_query).fetchone()

            if result:
                print("Schema 'public' already exists. No need to recreate.")
            else:
                # Recreate the public schema
                connection.execute(text("CREATE SCHEMA public;"))
                connection.execute(text("GRANT ALL ON SCHEMA public TO postgres;"))
                connection.execute(text("GRANT ALL ON SCHEMA public TO public;"))
                print("Public schema created successfully.")

            # Drop all objects in the public schema if it exists
            connection.execute(text("DROP SCHEMA public CASCADE;"))
            connection.execute(text("CREATE SCHEMA public;"))
            connection.execute(text("GRANT ALL ON SCHEMA public TO postgres;"))
            connection.execute(text("GRANT ALL ON SCHEMA public TO public;"))
            print("Database schema reset successfully.")

        # Drop user-defined data types and dependent objects using psycopg2
        with psycopg2.connect(
            dbname=settings.POSTGRES_DB,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_HOST,
            port=settings.DATABASE_PORT,
        ) as conn:
            with conn.cursor() as cursor:
                # Drop all tables in the public schema
                drop_tables_query = """
                DO $$
                BEGIN
                    EXECUTE (
                        SELECT string_agg('DROP TABLE IF EXISTS ' || quote_ident(table_schema) || '.' || quote_ident(table_name) || ' CASCADE', '; ')
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                    );
                END $$;
                """
                cursor.execute(drop_tables_query)

                # Drop all user-defined types
                drop_types_query = """
                DO $$ 
                DECLARE 
                    rec RECORD;
                BEGIN
                    -- Iterate over all user-defined types in the current database
                    FOR rec IN 
                        SELECT n.nspname AS schema_name, t.typname AS type_name
                        FROM pg_type t
                        JOIN pg_namespace n ON t.typnamespace = n.oid
                        WHERE n.nspname = 'public' -- Restrict to the 'public' schema
                          AND t.typtype = 'c'      -- Only composite types
                          AND t.typname NOT LIKE 'pg_%' -- Exclude system types
                    LOOP
                        -- Drop each type found
                        EXECUTE format('DROP TYPE IF EXISTS %I.%I CASCADE', rec.schema_name, rec.type_name);
                    END LOOP;
                END $$;
                """
                cursor.execute(drop_types_query)
                conn.commit()
                print("User-defined data types and dependent objects dropped successfully.")

        # Ensure the public schema is recreated with appropriate permissions
        with psycopg2.connect(
            dbname=settings.POSTGRES_DB,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_HOST,
            port=settings.DATABASE_PORT,
        ) as conn:
            with conn.cursor() as cursor:
                recreate_schema_query = """
                CREATE SCHEMA public;
                GRANT ALL ON SCHEMA public TO postgres;
                GRANT ALL ON SCHEMA public TO public;
                """
                cursor.execute(recreate_schema_query)
                conn.commit()
                print("Public schema recreated and permissions granted.")

    except OperationalError as e:
        print("Failed to reset the database.")
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_database()
