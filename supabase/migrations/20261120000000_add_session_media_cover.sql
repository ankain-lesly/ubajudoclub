-- Migration: Add is_cover to session_media for designated session cover images
-- Timestamp: 2026-11-20

ALTER TABLE public.session_media
ADD COLUMN IF NOT EXISTS is_cover BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_session_media_cover
ON public.session_media(session_id, is_cover);

COMMENT ON COLUMN public.session_media.is_cover IS 'Indicates whether this media item is the designated cover image for the training session';
