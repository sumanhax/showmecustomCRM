const userRoles = () => {
    const token = sessionStorage.getItem('chess_admin_token')
    if (token !== undefined && token !== null) {
        const storageUserRole = localStorage.getItem('user_short_name')
        return storageUserRole
    }
    return 'none'
}
export default userRoles