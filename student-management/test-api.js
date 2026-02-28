// Test script for all API endpoints
const http = require("http");

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== STUDENT API TESTS ===\n");

  try {
    // Test 1: GET all students
    console.log("1. GET /api/students");
    const getAll = await makeRequest("GET", "/api/students");
    console.log(`   Status: ${getAll.status}`);
    console.log(`   Students: ${getAll.data.length}`);
    console.log();

    // Test 2: GET single student
    console.log("2. GET /api/students/1");
    const getOne = await makeRequest("GET", "/api/students/1");
    console.log(`   Status: ${getOne.status}`);
    console.log(`   Name: ${getOne.data.firstName} ${getOne.data.lastName}`);
    console.log();

    // Test 3: CREATE a new student
    console.log("3. POST /api/students (Create)");
    const newStudent = {
      firstName: "Test",
      lastName: "User",
      email: "test@esisa.ac.ma",
      phone: "+212700000000",
      studentId: "STU999"
    };
    const create = await makeRequest("POST", "/api/students", newStudent);
    console.log(`   Status: ${create.status}`);
    console.log(`   ID: ${create.data.id}`);
    const newId = create.data.id;
    console.log();

    // Test 4: UPDATE student
    console.log(`4. PUT /api/students/${newId} (Update)`);
    const updateData = {
      firstName: "Updated",
      lastName: "Name"
    };
    const update = await makeRequest("PUT", `/api/students/${newId}`, updateData);
    console.log(`   Status: ${update.status}`);
    console.log(`   Name: ${update.data.firstName} ${update.data.lastName}`);
    console.log();

    // Test 5: DELETE student
    console.log(`5. DELETE /api/students/${newId} (Delete)`);
    const deleteRes = await makeRequest("DELETE", `/api/students/${newId}`);
    console.log(`   Status: ${deleteRes.status}`);
    console.log(`   Success: ${deleteRes.data.success}`);
    console.log();

    // Test 6: Verify deletion
    console.log(`6. GET /api/students/${newId} (Verify deletion)`);
    const verify = await makeRequest("GET", `/api/students/${newId}`);
    console.log(`   Status: ${verify.status}`);
    console.log();

    console.log("=== ALL TESTS COMPLETED ===");
  } catch (error) {
    console.error("Error:", error);
  }
}

runTests();
