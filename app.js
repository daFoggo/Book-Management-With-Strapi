$(document).ready(function () {
  console.log("Page loaded");
  function loadTable() {
    // lay du lieu tu server
    $.ajax({
      url: "http://localhost:1337/api/thong-tin-saches/?populate=*",
      method: "GET",
      success: function (data) {
        console.log("Data Loaded Successfully");
        toTable(data["data"]); // sau khi tai du lieu thanh cong thi chuyen sang bang
      },
      error: function (err) {
        console.log("Error loading data: ", err);
      },
    });
  }

  // chuyen sang bang
  function toTable(data) {
    let bookTable = $("#bookTable");
    bookTable.empty();

    $.each(data, function (_, book) {
      let attributes = book.attributes; 
      let row = $("<tr></tr>");

      //them cac du lieu vao hang
      row.append($("<td></td>").text(attributes.maSach));
      row.append($("<td></td>").text(attributes.tenSach));
      row.append($("<td></td>").text(attributes.tenTacGia));
      row.append(
        $("<td></td>").text(attributes.the_loai.data?.attributes.TenTheLoai)
      );
      row.append($("<td></td>").text(attributes.namXuatBan));
      // them nut modify va delete
      row.append(
        '<td><button class="modify btn btn-light btn-sm m-1" data-id="' +
          book.id +
          '">Chỉnh sửa</button><button class="delete btn btn-light btn-sm m-1" data-id="' +
          book.id +
          '">Xoá</button></td>'
      );
      bookTable.append(row); // them hang vao bang
    });
  }

  // lay du lieu tu server
  loadTable();

  // xoa du lieu
  $("#bookTable").on("click", ".delete", function () {
    let id = $(this).data("id");
    console.log(id);
    console.log("delete: ", id);
    
    $.ajax({
      url: "http://localhost:1337/api/thong-tin-saches/" + id,
      method: "DELETE",
      success: function () {
        console.log("Data Deleted Successfully");
        loadTable();
      },
      error: function (err) {
        console.log("Error deleting data: ", err);
      },
    });
  });

  // them du lieu
  $("#addBtn").click(function () {
    let addModal = $("#addModal");
    addModal.modal("show");
    // gui du lieu len server
    $("#saveAdd").off("click").click(function () {
      // lay du lieu tu input
      let maSach = $("#addMaSach").val();
      let tenSach = $("#addTenSach").val();
      let tenTacGia = $("#addTacGia").val();
      let theLoai = $("#addTheLoai").val();
      let namXuatBan = $("#addNXB").val();
      $.ajax({
        url: "http://localhost:1337/api/thong-tin-saches/?populate=*",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          data: {
            maSach: maSach,
            tenSach: tenSach,
            tenTacGia: tenTacGia,
            theLoai: theLoai,
            namXuatBan: namXuatBan,
          },
        }),
        success: function () {
          console.log("Data Added Successfully");
          loadTable();
          $("#addMaSach").val("");
          $("#addTenSach").val("");
          $("#addTacGia").val("");
          $("#addTheLoai").val("");
          $("#addNXB").val("");

          addModal.modal("hide");
        },
        error: function (err) {
          console.log("Error adding data: ", err);
          const toast = $(".toast");
          $(".toast-body").text("Sai kiểu dữ liệu hoặc thiếu dữ liệu");
          setTimeout(function () {
            toast.toast("show");

            setTimeout(function () {
              toast.toast("hide");
            }, 2000);
          }, 100);
        },
      });
    });
  });
  // cap nhat du lieu
  $("#bookTable").on("click", ".modify", function () {
    console.log("this1", $(this));
    let id = $(this).data("id");
    console.log("id :", id);
    console.log("modify: ", id);
    let modifyModal = $("#modifyModal");
    modifyModal.modal("show");


    // lay du lieu tu hang de chuyen vao modal
    let rowData = $(this)
      .closest("tr")
      .find("td")
      .map(function () {
        console.log($(this).text());
        return $(this).text();
      })
      .get();

    $("#modifyMaSach").val(rowData[0]);
    $("#modifyTenSach").val(rowData[1]);
    $("#modifyTacGia").val(rowData[2]);
    $("#modifyTheLoai").val(rowData[3]);
    $("#modifyNXB").val(rowData[4]);

    $("#saveModify")
      .off("click")
      .click(function () {
        // lay du lieu tu input
        let maSach = $("#modifyMaSach").val();
        let tenSach = $("#modifyTenSach").val();
        let tenTacGia = $("#modifyTacGia").val();
        let theLoai = $("#modifyTheLoai").val();
        let namXuatBan = $("#modifyNXB").val();

        // gui du lieu len server
        $.ajax({
          url: "http://localhost:1337/api/thong-tin-saches/" + id,
          method: "PUT",
          contentType: "application/json",
          data: JSON.stringify({
            data: {
              maSach: maSach,
              tenSach: tenSach,
              tenTacGia: tenTacGia,
              theLoai: theLoai,
              namXuatBan: namXuatBan,
            },
          }),
          success: function (data) {
            console.log(data);
            console.log("Data Modified Successfully");
            loadTable();

            //reset du lieu modal
            $("#modifyMaSach").val("");
            $("#modifyTenSach").val("");
            $("#modifyTacGia").val("");
            $("#modifyTheLoai").val("");
            $("#modifyNXB").val("");
            modifyModal.modal("hide");
          },
          error: function (err) {
            console.log("Error modifying data: ", err);
            const toast = $(".toast");
            $(".toast-body").text("Sai kiểu dữ liệu hoặc thiếu dữ liệu");
            setTimeout(function () {
              toast.toast("show");

              setTimeout(function () {
                toast.toast("hide");
              }, 2000);
            }, 100);
          },
        });
      });
  });

  //tim kiem theo the loai
  $("#searchBtn").click(function () {
    let searchValue = $("#searchBar").val();
    $.ajax({
      url:
        "http://localhost:1337/api/thong-tin-saches?filters[the_loai][TenTheLoai][$contains]=" +
        searchValue +
        "&populate=*",
      method: "GET",
      success: function (data) {
        console.log("Data Loaded Successfully");
        toTable(data["data"]);
      },
      error: function (err) {
        console.log("Error loading data: ", err);
      },
    });
  });
});
