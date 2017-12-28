export default PlayerAuth = {
    validatedPlayer(object, viewer) {

        // The player can see all their own fields
        if(viewer.id == object.id) {
            return object;
        }

        // The player who is targeting this can see all but email
        if(viewer.assignment.target == object.id) {
            delete object['email'];
            return object;
        }

        // Everyone else can see nothing
        return 
    }
}