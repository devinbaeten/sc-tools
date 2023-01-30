//
//	friends.js
//	SC Tools
//
//	Created by Devin Baeten on 2023-01-29.
//

var table = $('#friendList').DataTable({
	paging: true,
	order: [[5, 'desc']],
	columns: [
		{
			data: 'Bitmoji',
			orderable: false,
			render: function (data, type) {
				if (type === 'display') {
					let link = "https://sdk.bitmoji.com/render/panel/" + data.selfie + "-" + data.avatar + "-v1.webp?transparent=1&scale=1";
					let image = '<img src="' + link + '" width="50px;"></img>';
					return image;
				}
				return data;
			}
		},
		{
			data: 'Display Name'
		},
		{
			data: 'Username',
			render: function (data, type) {
				let current_username = data.mutableUsername;
				let inital_username = data.username;
				if (type === 'display') {
					let css = "";
					if (current_username !== inital_username) {
						css = "text-decoration-line-through";
					}
					let html = '<span class="' + css + '">' + inital_username + '</span>';
					if (current_username !== inital_username) {
						html = html + " " + '<span class="fw-bold">' + current_username + '</span>'
					}
					return html;
				}
				return current_username;
			}
		},
		{
			data: 'Changed Username',
			render: function (data, type) {
				let current_username = data.mutableUsername;
				let inital_username = data.username;
				if (type === 'display') {
					let current_username = data.mutableUsername;
					let inital_username = data.username;
					let status = "NO"
					let css = "text-success";
					if (current_username !== inital_username) {
						status = "YES"
						css = "fw-bold text-danger";
					}
					let html = '<span class="' + css + '">' + status + '</span>';
					return html;
				}
				if (current_username !== inital_username) {
					return 1
				} else {
					return 0;
				}
			}
		}, {
			data: 'Streak Length',
			render: function (data, type) {
				if (type === 'display') {
					if (data > 0) {
						return data;
					} else {
						return "-";
					}
				}
				return data;
			}
		}, {
			data: 'Friends Since',
			render: function (data, type) {
				if (type === 'display') {
					if (Number.isInteger(data.ts)) {
						return moment(data.ts).format("dddd, MMMM Do YYYY, h:mm:ss a");
					} else {
						if (Number.isInteger(data.reverseTs)) {
							return moment(data.reverseTs).format("dddd, MMMM Do YYYY, h:mm:ss a");
						}
						return "-";
					}
				}
				if (Number.isInteger(data.ts)) {
					return data.ts;
				} else {
					if (Number.isInteger(data.reverseTs)) {
						return data.reverseTs;
					}
					return 0;
				}
			}
		}
	]
});
	
$(document).ready(function() {
	
	$("#parseButton").click(function() {
		var inputFile = $("#inputFile")[0].files[0];
		
		var reader = new FileReader();
		reader.onload = function(event) {
			var json = JSON.parse(event.target.result);
			parseFriends(json);
		};
		
		reader.readAsText(inputFile);
	});
	
	$("#inputFile").change(function(){
		$("#parseButton").removeClass('disabled');
	});
	
});

function parseFriends(json) {
	
	$("#friendList tbody tr").remove();
	
	json.friends.forEach(friendRow);
	
	$("#parseButton").text("Re-generate Friends List");
	
}

function friendRow(info, index) {
	
	let current_username = info.name;
	let mutable_username = info['mutable_username'];
	
	table.row.add({
		"Bitmoji": {
			"selfie": info['bitmoji_selfie_id'],
			"avatar": info['bitmoji_avatar_id']
		},
		"Display Name": info.display,
		"Username": {
			"username": info.name,
			"mutableUsername": info['mutable_username']
		},
		"Changed Username": {
			"username": info.name,
			"mutableUsername": info['mutable_username']
		},
		"Streak Length": info['snap_streak_count'],
		"Friends Since": {
			"ts": parseInt(info.ts),
			"reverseTs": parseInt(info['reverse_ts'])
		}
	});
	table.draw();
	
	// let row = document.createElement("tr");
	// 
	// 	let th = document.createElement("th");
	// 	
	// 	let td1 = document.createElement("td");
	// 	
	// 		let bitmoji = document.createElement("img");
	// 		$(bitmoji).attr("src", "https://sdk.bitmoji.com/render/panel/" + info['bitmoji_selfie_id'] + "-" + info['bitmoji_avatar_id'] + "-v1.webp?transparent=1&scale=1");
	// 		$(bitmoji).attr("width", "25px");
	// 	
	// 	$(td1).append(bitmoji);
	// 	
	// 	let td2 = document.createElement("td");
	// 	$(td2).text(info.display);
	// 	
	// 	let td3 = document.createElement("td");
	// 	$(td3).text(info.name);
	// 	
	// 	let td4 = document.createElement("td");
	// 	$(td4).text(info['snap_streak_count']);
	// 	
	// 	let td5 = document.createElement("td");
	// 	$(td5).text(info.ts);
	// 	
	// $(row).append(td1);
	// $(row).append(td2);
	// $(row).append(td3);
	// $(row).append(td4);
	// $(row).append(td5);
	// 
	// $("#friendList tbody").append(row);
	
	return;
	
}