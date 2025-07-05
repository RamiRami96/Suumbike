# Test Database Scripts

This directory contains scripts for managing the test database. All scripts should be run from this directory.

## Main Script: seed.js

The `seed.js` script is the primary tool for database setup and verification. It can:
- Clear and seed the database with test users
- Assign room IDs to users for testing room functionality
- Check and display the current database state

### Usage

Navigate to the test-db directory first:
```bash
cd test-db
```

#### Basic Commands

**Seed users only:**
```bash
node seed.js
```

**Seed users and assign room IDs:**
```bash
node seed.js --rooms
```

**Seed users and show database state:**
```bash
node seed.js --check
```

**Full setup with verification:**
```bash
node seed.js --rooms --check
```

**Check database state only (no seeding):**
```bash
node seed.js --check-only
```

**Show help:**
```bash
node seed.js --help
```

#### Command Line Options

- `--rooms` or `-r`: Assign room IDs to some users after seeding
- `--check` or `-c`: Show database statistics after operations
- `--check-only`: Only check database state without seeding
- `--help` or `-h`: Show usage information

#### What the script does

1. **Seeding**: Creates 20 test users with various profiles
2. **Room Assignment**: Assigns unique room IDs to up to 10 users (or half the total users)
3. **Database Check**: Shows statistics about users with/without rooms

## Legacy Script: checkUsers.js

This script only checks the database state and displays user information. It's maintained for compatibility but the `seed.js --check-only` option provides the same functionality with better formatting.

```bash
node checkUsers.js
```

## Examples

**Quick setup for testing rooms:**
```bash
node seed.js --rooms --check
```

**Just check what's currently in the database:**
```bash
node seed.js --check-only
```

**Reset and seed fresh data:**
```bash
node seed.js
```

## Notes

- The script will clear existing data before seeding (except when using `--check-only`)
- Room IDs are generated uniquely for each run
- All scripts require a properly configured Prisma database connection
- Make sure your `.env` file in the app directory has the correct `DATABASE_URL`
