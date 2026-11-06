
const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const studentData = {
        name: document.getElementById("name").value.trim(),
        roll: document.getElementById("roll").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        department: document.getElementById("department").value,
        size: document.getElementById("size").value
    };

    try {

        const response = await fetch(
            "https://tshirt-19hb.onrender.com/api/students",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            }
        );

        const result = await response.json();

        document.getElementById("message").innerText =
            result.message;

        if (response.ok) {
            studentForm.reset();
        }

    } catch (error) {

        document.getElementById("message").innerText =
            "Server connection failed!";

        console.log(error);
    }

});
