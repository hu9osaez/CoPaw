import { useCallback, useState, useRef, useEffect } from "react";
import { Input, InputRef, Tooltip, message } from "antd";
import { Edit } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";


import styles from "./EditableTitle.module.less";

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function EditableTitle({
  title,
  onSave,
  onCancel,
  isEditing = false,
  isLoading = false,
}: EditableTitleProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(title);
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const inputRef = useRef<InputRef>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingLocal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingLocal]);

  const handleStartEditing = useCallback(() => {
    setIsEditingLocal(true);
    setInputValue(title);
  }, [title]);

  const handleSave = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      message.warning(t("chat.titleEmpty"));
      return;
    }
    onSave(trimmedValue);
    setIsEditingLocal(false);
  }, [inputValue, onSave, t]);

  const handleCancel = useCallback(() => {
    setIsEditingLocal(false);
    setInputValue(title);
    onCancel?.();
  }, [title, onCancel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const handleBlur = useCallback(() => {
    // Small delay to allow click events to fire first
    setTimeout(() => {
      if (isEditingLocal) {
        handleSave();
      }
    }, 150);
  }, [isEditingLocal, handleSave]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  if (isEditingLocal) {
    return (
      <div className={styles.editTitleContainer}>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={styles.editTitleInput}
          autoFocus
          disabled={isLoading}
        />
        {isLoading && (
          <span className={styles.loadingIndicator}>
            <LoadingOutlined spin />
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={styles.editTitleContainer}>
      <span
        className={styles.titleDisplay}
        onClick={handleStartEditing}
      >
        {title}
      </span>
      <Tooltip title={t("chat.rename")}>
        <Edit
          size={16}
          className={styles.editIcon}
          onClick={handleStartEditing}
        />
      </Tooltip>
    </div>
  );
}
