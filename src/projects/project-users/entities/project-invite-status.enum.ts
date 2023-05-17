export enum ProjectInviteStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Declined = 'declined',
}

export function localizeProjectInviteStatus(role: ProjectInviteStatus) {
    return {
        [ProjectInviteStatus.Pending]: 'Отправлено',
        [ProjectInviteStatus.Accepted]: 'Принято',
        [ProjectInviteStatus.Declined]: 'Отклонено',
    }[role] || role;
}