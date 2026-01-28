const userRoles = () => {
    const token = sessionStorage.getItem('crm_login_token')
    if (token !== undefined && token !== null) {
        const storageUserRole = localStorage.getItem('user_short_name')
        return storageUserRole
    }
    return 'none'
}
export default userRoles