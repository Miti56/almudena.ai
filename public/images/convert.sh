for img in *.png *.JPG; do
  cwebp -q 75 "$img" -o "${img%.*}.webp"
done
