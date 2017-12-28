function authAssignment(object, viewer) {

    console.log("Object: " + JSON.stringify(object));
    console.log("Viewer: " + JSON.stringify(viewer));

    // Only the owner should be able to see their assignment
    if(viewer.id == object.killer || viewer.isAdmin) {
        return true;
    }
}

function authAssignments(viewer) {
    return viewer.isAdmin;
}

module.exports = {
    authAssignment
}