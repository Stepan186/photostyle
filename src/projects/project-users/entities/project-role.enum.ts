export enum ProjectRole {
    Owner = 'owner',
    Employee = 'employee',
    Organizer = 'organizer',
    Client = 'client',
}

export function localizeProjectRole(role: ProjectRole) {
    return {
        [ProjectRole.Owner]: 'Владелец',
        [ProjectRole.Employee]: 'Сотрудник',
        [ProjectRole.Organizer]: 'Организатор',
        [ProjectRole.Client]: 'Клиент',
    }[role] || role;
}