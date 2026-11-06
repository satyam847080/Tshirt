const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const studentData = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        department: document.getElementById("department").value,
        size: document.getElementById("size").value
    };

    try {

        const response = await fetch("http://localhost:5000/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        document.getElementById("message").innerText = result.message;

        if (response.ok) {
            studentForm.reset();
        }

    } catch (error) {

        document.getElementById("message").innerText =
            "Server connection failed!";

        console.log(error);
    }

});