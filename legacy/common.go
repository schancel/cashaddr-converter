package legacy

const (
	P2KH        uint8 = 0
	P2KHCopay         = 28
	P2SH              = 5
	P2SHCopay         = 40
	P2KHTestnet       = 111
	P2SHTestnet       = 196
)

type Address struct {
	Version uint8
	Payload []uint8
}
