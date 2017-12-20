package legacy

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestToLegacyP2KH(t *testing.T) {
	legacy, err := Decode("19NoN69ntmV9nKHBjArLJXXCNq3AvvMsqG")
	assert.Nil(t, err)
	legacy.Version = P2KHCopay
	copay, err := legacy.Encode()
	assert.Nil(t, err)
	assert.Equal(t, copay, "CQqgw8VrmpTggTBcQvBFt39DzxFavppafB", "Conversion failed")

}

func TestToLegacyP2SH(t *testing.T) {
	legacy, err := Decode("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy")
	assert.Nil(t, err)
	legacy.Version = P2SHCopay
	copay, err := legacy.Encode()
	assert.Nil(t, err)
	assert.Equal(t, copay, "HNyFLowu5sKhpYeSnQJmqBWFYWorHKAWDE", "Conversion failed")
}
