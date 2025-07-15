#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# 1. JSON 매핑 파일 경로 (Git Bash 사용 시 /c/…, WSL 사용 시 /mnt/c/... 형태로 조정)
MAPPING_FILE="/c/Users/관리자/Desktop/새 폴더/kr-en match.json"

# 2. 대상 디렉터리(로컬 클론된 저장소 내)
TARGET_DIR="heroaran.github.io/library/images/items"

# 3. jq 설치 여부 확인
if ! command -v jq &>/dev/null; then
  echo "Error: jq가 필요합니다. 'sudo apt install jq' 또는 'pacman -S jq' 등으로 설치하세요." >&2
  exit 1
fi

# 4. 처리할 확장자 목록
EXTENSIONS=(png jpg jpeg gif)

# 5. 파일별로 매핑 적용 후 이름 변경
for ext in "${EXTENSIONS[@]}"; do
  shopt -s nullglob
  for filepath in "$TARGET_DIR"/*."$ext"; do
    filename="$(basename "$filepath")"
    name="${filename%.*}"

    # JSON array에서 name_en이 key와 일치하는 첫 번째 name_kr 값 추출
    newname=$(jq -r --arg key "$name" \
      '[.[] | select(.name_en == $key) | .name_kr] | .[0]' \
      "$MAPPING_FILE")

    if [[ -n "$newname" && "$newname" != "null" ]]; then
      newfile="${newname}.${ext}"
      # 이미 같은 이름이 있으면 건너뛰기
      if [[ -e "$TARGET_DIR/$newfile" ]]; then
        echo "⚠️ Skipping: '$newfile' already exists."
      else
        echo "Renaming: '$filename' → '$newfile'"
        mv "$filepath" "$TARGET_DIR/$newfile"
      fi
    else
      echo "매핑 없음: '$filename'"
    fi
  done
done
