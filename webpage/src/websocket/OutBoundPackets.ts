export interface OutBoundPacket {
    type: string
}

enum PacketType {
    Connect = ""
}

export interface OutBoundServerConnect extends OutBoundPacket {
    clientName: string
    serverId: number
}