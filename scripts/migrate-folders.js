#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// =============================================================================
// MIGRATION SCRIPT: parts/ -> _components/
// =============================================================================

const MIGRATION_CONFIG = {
  // Source patterns to find
  patterns: ["src/**/parts/**", "src/**/*parts*"],

  // File types to process
  fileExtensions: [".tsx", ".ts", ".js", ".jsx"],

  // Directories to exclude
  exclude: ["node_modules", "dist", "build", ".git"],
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  const prefix = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function findFiles(pattern) {
  return glob.sync(pattern, {
    ignore: MIGRATION_CONFIG.exclude.map((dir) => `**/${dir}/**`),
    nodir: true,
  });
}

function updateImportPath(filePath, oldPath, newPath) {
  const content = fs.readFileSync(filePath, "utf8");
  const updatedContent = content.replace(
    new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    newPath
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, "utf8");
    return true;
  }
  return false;
}

function renameDirectory(oldPath, newPath) {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    return true;
  }
  return false;
}

// =============================================================================
// MIGRATION FUNCTIONS
// =============================================================================

function migrateFolderStructure() {
  log("Starting folder structure migration...");

  // Step 1: Find all parts/ directories
  const partsDirs = findFiles("src/**/parts");
  log(`Found ${partsDirs.length} parts/ directories`);

  const migrations = [];

  // Step 2: Plan migrations
  partsDirs.forEach((dir) => {
    const relativePath = path.relative("src", dir);
    const newPath = dir.replace(/\/parts\//g, "/_components/");
    const relativeNewPath = path.relative("src", newPath);

    migrations.push({
      oldPath: dir,
      newPath: newPath,
      oldImport: relativePath,
      newImport: relativeNewPath,
    });
  });

  // Step 3: Execute migrations
  migrations.forEach((migration) => {
    try {
      // Rename directory
      if (renameDirectory(migration.oldPath, migration.newPath)) {
        log(`Renamed: ${migration.oldPath} -> ${migration.newPath}`, "success");
      }
    } catch (error) {
      log(`Failed to rename ${migration.oldPath}: ${error.message}`, "error");
    }
  });

  return migrations;
}

function updateImportStatements(migrations) {
  log("Updating import statements...");

  let totalUpdates = 0;

  // Find all TypeScript/JavaScript files
  const files = findFiles(`src/**/*.{ts,tsx,js,jsx}`);

  files.forEach((file) => {
    let fileUpdated = false;

    migrations.forEach((migration) => {
      // Update relative imports
      if (updateImportPath(file, migration.oldImport, migration.newImport)) {
        fileUpdated = true;
      }

      // Update absolute imports (with @/ alias)
      const oldAbsolutePath = `@/${migration.oldImport}`;
      const newAbsolutePath = `@/${migration.newImport}`;
      if (updateImportPath(file, oldAbsolutePath, newAbsolutePath)) {
        fileUpdated = true;
      }
    });

    if (fileUpdated) {
      totalUpdates++;
      log(`Updated imports in: ${file}`, "success");
    }
  });

  log(`Updated ${totalUpdates} files`, "success");
}

function updateRouteConfig(migrations) {
  log("Updating route configuration...");

  const routeFiles = ["src/main.tsx", "src/lib/utils/routing/routeConfig.tsx"];

  routeFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      let fileUpdated = false;

      migrations.forEach((migration) => {
        if (updateImportPath(file, migration.oldImport, migration.newImport)) {
          fileUpdated = true;
        }
      });

      if (fileUpdated) {
        log(`Updated route config: ${file}`, "success");
      }
    }
  });
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

function main() {
  try {
    log("🚀 Starting DeltaKonkur Refactoring Migration");
    log("This script will migrate parts/ folders to _components/ folders");

    // Check if we're in the right directory
    if (!fs.existsSync("src")) {
      throw new Error("Please run this script from the project root directory");
    }

    // Create backup
    const backupDir = `backup-${Date.now()}`;
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
      log(`Created backup directory: ${backupDir}`);
    }

    // Execute migrations
    const migrations = migrateFolderStructure();
    updateImportStatements(migrations);
    updateRouteConfig(migrations);

    log("🎉 Migration completed successfully!", "success");
    log("Please review the changes and test your application");
    log("If issues occur, you can restore from the backup directory");
  } catch (error) {
    log(`Migration failed: ${error.message}`, "error");
    process.exit(1);
  }
}

// =============================================================================
// SCRIPT EXECUTION
// =============================================================================

if (require.main === module) {
  main();
}

module.exports = {
  migrateFolderStructure,
  updateImportStatements,
  updateRouteConfig,
};
