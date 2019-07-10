
const uri = "api/customer";
let customers = null;
function getCount(data) {
  const el = $("#counter");
  let name = "record found.";
  if (data) {
    if (data > 1) {
      name = "records found.";
    }
    el.text(data + " " + name);
  } else {
    el.text("No " + name);
  }
}

$(document).ready(function() {
  getData();
});

function getData() {
  $.ajax({
    type: "GET",
    url: uri,
    cache: false,
    success: function(data) {
      const tBody = $("#customerlist");

      $(tBody).empty();

      getCount(data.length);

      $.each(data, function(key, cust) {
        const tr = $("<tr></tr>")
            .append($("<td></td>").text(cust.firstName))
            .append($("<td></td>").text(cust.lastName))
            .append($("<td></td>").text(cust.phoneNumber))
            .append($("<td></td>").text(cust.email))
            .append($("<td></td>").text(new Date(cust.startDate)))
          .append(
            $("<td></td>").append(
              $("<button>Edit</button>").on("click", function() {
                editCustomer(cust.id);
              })
            )
          )
          .append(
            $("<td></td>").append(
              $("<button>Delete</button>").on("click", function() {
                deleteCustomer(cust.id);
              })
            )
          );

        tr.appendTo(tBody);
      });

      customers = data;
    }
  });
}

function addCustomer() {
  const cust = {
      firstName: $("#add-fname").val(),
      lastName: $("#add-lname").val(),
      phoneNumber: $("#add-phone").val(),
      email: $("#add-email").val()
  };

  $.ajax({
    type: "POST",
    accepts: "application/json",
    url: uri,
    contentType: "application/json",
    data: JSON.stringify(cust),
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Something went wrong!");
    },
    success: function(result) {
      getData();
        $("#add-fname").val("");
        $("#add-lname").val("");
        $("#add-phone").val("");
        $("#add-email").val("");
    }
  });
}

function deleteCustomer(id) {
  $.ajax({
    url: uri + "/" + id,
    type: "DELETE",
    success: function(result) {
      getData();
    }
  });
}

function editCustomer(id) {
  $.each(customers, function(key, cust) {
    if (cust.id === id) {
        $("#edit-fname").val(cust.firstName);
        $("#edit-lname").val(cust.lastName);
        $("#edit-phone").val(cust.phoneNumber);
        $("#edit-email").val(cust.email);
        $("#edit-id").val(cust.id);
    }
  });
  $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function() {
  const cust = {
      firstName: $("#edit-fname").val(),
      id: $("#edit-id").val(),
      lastName: $("#edit-lname").val(),
      phoneNumber: $("#edit-phone").val(),
      email: $("#edit-email").val()
  };

  $.ajax({
    url: uri + "/" + $("#edit-id").val(),
    type: "PUT",
    accepts: "application/json",
    contentType: "application/json",
    data: JSON.stringify(cust),
    success: function(result) {
      getData();
    }
  });

  closeInput();
  return false;
});

function closeInput() {
  $("#spoiler").css({ display: "none" });
}