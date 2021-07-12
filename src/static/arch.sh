#!/bin/bash

# Check bash version
[ "${BASH_VERSINFO:-0}" -ge 4 ] || (echo "Scripts requires bash >= 4.x" && exit 1)

# Check UEFI system
ls /sys/firmware/efi/efivars &> /dev/null || (printf "This script is for EFI based systems only. Ensure booting in UEFI mode.\n" && exit 1)


# Check connectivity
printf "Checking connectivity..."
ping -c 1 archlinux.org &> /dev/null || (printf "\nUnable to connect to internet. Connection needed to proceed with installation.\n" && exit 1)
printf "Ok\n"

# Update system clock
printf "Updating system clock..."
timedatectl set-ntp true
printf "Ok\n"

# Disk selection
read -r -p "Remove all drives and install system? [Y/n] " response
response=${response,,}    # tolower
[[ "$response" =~ ^(yes|y|)$ ]] || (echo "Script does not support manual partitioning at the moment" && exit 1)

IFS=
out=$(lsblk -npdo NAME,SIZE -e7)
if [ $(echo $out | wc -l) -gt 1 ]; then
  echo $out | nl
  read -r -p "Disk to partition: " response
  drive=$(echo $out | sed "${response}q;d" | tr -s ' ' | cut -d ' ' -f 1)
else
  drive=$(echo $out | cut -d ' ' -f 1)
fi
printf "Installing system on \"$drive\"\n"

# Disk partitioning
printf "Creating partitions..."
parted --script $drive \
  mklabel gpt \
  mkpart primary 1MiB 300MiB \
  mkpart primary 300MiB 100% \
  name 1 boot \
  name 2 root \
  set 1 boot
printf "Done\n"

partitions=$(lsblk $drive -nplo NAME,TYPE | grep part | cut -d ' ' -f 1)
boot=$(echo $partitions | sed '1q;d')
root=$(echo $partitions | sed '2q;d')
printf "Boot: $boot \t Root: $root\n"

# Format partitions/subvolumes
printf "Creating filesystems...\n"
mkfs.fat -F32 $boot
mkfs.btrfs $root
mount $root /mnt
btrfs su cr /mnt/@
btrfs su cr /mnt/@home
umount /mnt
mount -o noatime,compress=lzo,space_cache=v2,subvol=@ $root /mnt
mkdir -p /mnt/{boot,home}
mount $boot /mnt/boot
mount -o noatime,compress=lzo,space_cache=v2,subvol=@home $root /mnt/home

# Install Arch
printf "Installing base packages...\n"
pacstrap /mnt base base-devel linux linux-firmware btrfs-progs netctl dhcpcd wpa_supplicant man-db man-pages texinfo git neovim

genfstab -U /mnt >> /mnt/etc/fstab
arch-chroot /mnt

regions=$(cd /usr/share/zoneinfo && ls -d [[:upper:]]*)
echo $regions | nl | less -Fi
read -r -p "Select zone: " response
region=$(echo $regions | sed "${response}q;d")
cities=$(cd /usr/share/zoneinfo/$region && ls -d [[:upper:]]*)
echo $cities | nl | less -Fi
read -r -p "Select city: " response
city=$(echo $cities | sed "${response}q;d")
ln -sf /usr/share/zoneinfo/$region/$city /etc/localtime
hwclock --systohc

# Set locale
printf 'en_US.UTF-8 UTF-8\nen_US ISO-8859-1\n' > /etc/locale.gen
locale-gen
echo 'LANG=en_US.UTF-8' > /etc/locale.conf

# Hostname
read -r -p "Hostname: " response
echo $response > /etc/hostname
printf "127.0.0.1 localhost\n::1       localhost\n127.0.0.1 ${response}.localdomain ${response}\n" > /etc/hosts

# Install user packages
pacman -S grub efibootmgr grub-btrfs mtools dosfstools reflector linux-headers gvfs bluez bluez-utils alsa-utils pipewire pipewire-alsa pipewire-pulse pipewire-jack zsh openssh acpid acpi_call sway swaylock swayidle firefox gimp inkscape mpv alacritty wofi ttf-dejavu ttf-droid gnu-free-fonts ttf-ibm-plex ttf-liberation noto-fonts ttf-roboto ttf-ubuntu-font-family ttf-fira-mono ttf-fira-code dunst

# Initcpio
mkinitcpio -P

# Install grub
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
