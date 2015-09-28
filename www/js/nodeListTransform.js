var nodeListTransform = function (nodeData) {
	var nodes = nodeData.nodes;

	var nodeList = [];
	var macList = [];
	var extendedMacList = [];

	var nodeWithPreviousMac = function (node) {
		var macParts = node.mac.split(":");
		macParts[1] = (parseInt(macParts[1], 16) + 1).toString(16);

		return {
			hostname: node.hostname,
			mac: macParts.join(":")
		};
	}

	var nodeWithNextMac = function (node) {
		var macParts = node.mac.split(":");
		macParts[1] = (parseInt(macParts[1], 16) - 1).toString(16);

		return {
			hostname: node.hostname,
			mac: macParts.join(":")
		};
	}

	for (var id in nodes) {
		try {
			if (
				typeof nodes[id].nodeinfo.hostname !== "undefined" &&
				typeof nodes[id].nodeinfo.network.mesh.bat0.interfaces.wireless !== "undefined"
			) {
				nodeList.push({
					hostname: nodes[id].nodeinfo.hostname,
					macs: nodes[id].nodeinfo.network.mesh.bat0.interfaces.wireless
				});
			}
		} catch (e) {}
	}

	nodeList.forEach(function (node) {
		node.macs.forEach(function (mac) {
			macList.push({
				hostname: node.hostname,
				mac: mac
			});
		});
	});

	macList.forEach(function (node) {
		extendedMacList.push(node);
		extendedMacList.push(nodeWithPreviousMac(node));
		extendedMacList.push(nodeWithNextMac(node));
	});

	return extendedMacList.map(function (node) {
			return node.mac + "|" + node.hostname
		});
};

module.exports = nodeListTransform;