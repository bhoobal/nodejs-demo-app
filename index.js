const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
// GET /users endpoint to retrieve all users
app.get('/users', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'users.json');
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }
  try {
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read users.json' });
  }
});

// Middleware to parse JSON bodies
app.use(express.json());



// Serve landing page with user list UI
app.get('/', (req, res) => {
  const html = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>User List</title>',
    '  <style>',
    '    body { font-family: Arial, sans-serif; margin: 2rem; }',
    '    h1 { color: #333; }',
    '    table { border-collapse: collapse; width: 100%; margin-top: 1rem; }',
    '    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }',
    '    th { background: #f4f4f4; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <h1>User List</h1>',
    '  <form id="user-form" style="margin-bottom:2rem;">',
    '    <label>Name: <input type="text" name="name" required></label>',
    '    <label>Date of Birth: <input type="date" name="dob" required></label>',
    '    <label>Sex:',
    '      <select name="sex" required>',
    '        <option value="">Select</option>',
    '        <option value="M">Male</option>',
    '        <option value="F">Female</option>',
    '        <option value="O">Other</option>',
    '      </select>',
    '    </label>',
    '    <button type="submit">Add User</button>',
    '  </form>',
    '  <table id="users-table">',
    '    <thead>',
    '      <tr><th>Name</th><th>Date of Birth</th><th>Sex</th></tr>',
    '    </thead>',
    '    <tbody></tbody>',
    '  </table>',
    '  <script>',
    '    function loadUsers() {',
    '      fetch("/users")',
    '        .then(res => res.json())',
    '        .then(users => {',
    '          console.log("Fetched users:", users);',
    '          const tbody = document.querySelector("#users-table tbody");',
    '          if (users.length === 0) {',
    '            tbody.innerHTML = "<tr><td colspan=\\"3\\">No users found.</td></tr>";',
    '          } else {',
    '            tbody.innerHTML = users.map(u => `<tr><td>${u.name}</td><td>${u.dob}</td><td>${u.sex}</td></tr>`).join("");',
    '          }',
    '        })',
    '        .catch((err) => {',
    '          console.error("Failed to load users:", err);',
    '          document.querySelector("#users-table tbody").innerHTML = "<tr><td colspan=\\"3\\">Failed to load users.</td></tr>";',
    '        });',
    '    }',
    '    loadUsers();',
    '    document.getElementById("user-form").addEventListener("submit", function(e) {',
    '      e.preventDefault();',
    '      const form = e.target;',
    '      const data = {',
    '        name: form.name.value,',
    '        dob: form.dob.value,',
    '        sex: form.sex.value',
    '      };',
    '      fetch("/users", {',
    '        method: "POST",',
    '        headers: { "Content-Type": "application/json" },',
    '        body: JSON.stringify(data)',
    '      })',
    '      .then(res => {',
    '        if (!res.ok) throw new Error("Failed to add user");',
    '        form.reset();',
    '        loadUsers();',
    '      })',
    '      .catch(() => alert("Failed to add user"));',
    '    });',
    '  </script>',
    '</body>',
    '</html>'
  ].join('\n');
  res.send(html);
});

// POST /users endpoint to save user details
app.post('/users', (req, res) => {
  const { name, dob, sex } = req.body;
  if (!name || !dob || !sex) {
    return res.status(400).json({ error: 'name, dob, and sex are required' });
  }
  const user = { name, dob, sex };
  const filePath = path.join(__dirname, 'data', 'users.json');
  let users = [];
  if (fs.existsSync(filePath)) {
    try {
      users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      // If file is corrupted, start fresh
      users = [];
    }
  }
  users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  res.status(201).json({ message: 'User saved successfully', user });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
