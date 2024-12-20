const express = require('express');
const cors = require('cors');
const db = require('./db'); // MySQL connection

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Route to handle system data
app.post('/api/client-info', (req, res) => {

    const { systemData, networkInterfaces } = req.body;

    // Check if the required data exists
    if (!systemData || !networkInterfaces || networkInterfaces.length === 0) {
      return res.status(400).json({ error: 'Missing system or network data' });
    }
  
    // Sanitize system data
    const sanitizedSystemData = {
      hostname: systemData.hostname || null,
      
    };
  
    // Loop through network interfaces and insert each one
    const values = networkInterfaces.map((network) => {
      return [
        sanitizedSystemData.hostname,
        network.ipAddress || null,
        network.macAddress || null,
      ];
    });

    const query = `
    INSERT INTO client (hostname, ip_address, mac_address) VALUES ?`;

    db.query(query, [values], (err, result) => {
        if (err) {
        console.error('Error inserting in client table:', err);
        return res.status(500).json({ error: 'Failed to insert data into database' });
        }
        const clientId = result.insertId;
        res.status(200).json({ clientId });
    });

    
});


app.post('/api/system-info', (req, res) => {
    const { clientId, systemData} = req.body;
    

    const query2 = 'INSERT INTO sys_info (client_id, hostname, tmemory, fmemory, sys_release, sys_type, sys_arch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.execute(query2, [
        clientId,
        systemData.hostname,
        systemData.totalMemory,
        systemData.freeMemory,
        systemData.release,
        systemData.type,
        systemData.arch,
    ])
    .then(() => res.send('System data inserted successfully!'))
    .catch(err => res.status(500).send(err));


});

// //Route to handle the client data
// app.post('/api/client-info', (req, res) => {
    
// });


// Route to handle network data
app.post('/api/network-info', (req, res) => {
    const networkData = req.body.networkData;
    
    // Insert network data into MySQL (network table)
    const query = 'INSERT INTO network (interface, ip_address, mac_address) VALUES (?, ?, ?)';
    const promises = networkData.map(interface => {
        return db.execute(query, [interface.interfaceName, interface.ipAddress, interface.macAddress,]);
    });

    Promise.all(promises)
        .then(() => res.send('Network data inserted successfully!'))
        .catch(err => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});