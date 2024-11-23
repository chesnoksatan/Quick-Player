export const MPRIS_PLAYER_XML = `
<node xmlns:tp="http://telepathy.freedesktop.org/wiki/DbusSpec#extensions-v0">
  <interface name="org.mpris.MediaPlayer2.Player">
    <method name="Next" tp:name-for-bindings="Next">
    </method>

    <method name="Previous" tp:name-for-bindings="Previous">
    </method>

    <method name="Pause" tp:name-for-bindings="Pause">
    </method>

    <method name="PlayPause" tp:name-for-bindings="PlayPause">
    </method>

    <method name="Stop" tp:name-for-bindings="Stop">
    </method>

    <method name="Play" tp:name-for-bindings="Play">
    </method>

    <method name="Seek" tp:name-for-bindings="Seek">
      <arg direction="in" type="x" name="Offset" tp:type="Time_In_Us">
      </arg>
    </method>

    <method name="SetPosition" tp:name-for-bindings="Set_Position">
      <arg direction="in" type="o" tp:type="Track_Id" name="TrackId">
      </arg>
      <arg direction="in" type="x" tp:type="Time_In_Us" name="Position">
      </arg>
    </method>

    <method name="OpenUri" tp:name-for-bindings="Open_Uri">
      <arg direction="in" type="s" tp:type="Uri" name="Uri">
      </arg>
    </method>

    <property name="PlaybackStatus" tp:name-for-bindings="Playback_Status" type="s" tp:type="Playback_Status" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="LoopStatus" type="s" access="readwrite"
              tp:name-for-bindings="Loop_Status" tp:type="Loop_Status">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="Rate" tp:name-for-bindings="Rate" type="d" tp:type="Playback_Rate" access="readwrite">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="Shuffle" tp:name-for-bindings="Shuffle" type="b" access="readwrite">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="Metadata" tp:name-for-bindings="Metadata" type="a{sv}" tp:type="Metadata_Map" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
      <annotation name="org.qtproject.QtDBus.QtTypeName" value="QVariantMap"/>
    </property>

    <property name="Volume" type="d" tp:type="Volume" tp:name-for-bindings="Volume" access="readwrite">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true" />
    </property>

    <property name="Position" type="x" tp:type="Time_In_Us" tp:name-for-bindings="Position" access="read">
        <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="MinimumRate" tp:name-for-bindings="Minimum_Rate" type="d" tp:type="Playback_Rate" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="MaximumRate" tp:name-for-bindings="Maximum_Rate" type="d" tp:type="Playback_Rate" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="CanGoNext" tp:name-for-bindings="Can_Go_Next" type="b" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="CanGoPrevious" tp:name-for-bindings="Can_Go_Previous" type="b" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="CanPlay" tp:name-for-bindings="Can_Play" type="b" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="CanPause" tp:name-for-bindings="Can_Pause" type="b" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="CanSeek" tp:name-for-bindings="Can_Seek" type="b" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>

    <property name="CanControl" tp:name-for-bindings="Can_Control" type="b" access="read">
      <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="false"/>
    </property>

    <signal name="Seeked" tp:name-for-bindings="Seeked">
      <arg name="Position" type="x" tp:type="Time_In_Us">
      </arg>
    </signal>

  </interface>
</node>
`

export const MPRIS_XML = `
<node xmlns:tp="http://telepathy.freedesktop.org/wiki/DbusSpec#extensions-v0">
  <interface name="org.mpris.MediaPlayer2">
    <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>

    <method name="Raise" tp:name-for-bindings="Raise">
    </method>

    <method name="Quit" tp:name-for-bindings="Quit">
    </method>

    <property name="CanQuit" type="b" tp:name-for-bindings="Can_Quit" access="read">
    </property>

    <property name="Fullscreen" type="b" tp:name-for-bindings="Fullscreen" access="readwrite">
    </property>

    <property name="CanSetFullscreen" type="b" tp:name-for-bindings="Can_Set_Fullscreen" access="read">
    </property>

    <property name="CanRaise" type="b" tp:name-for-bindings="Can_Raise" access="read">
    </property>

    <property name="HasTrackList" type="b" tp:name-for-bindings="Has_TrackList" access="read">
    </property>

    <property name="Identity" type="s" tp:name-for-bindings="Identity" access="read">
    </property>

    <property name="DesktopEntry" type="s" tp:name-for-bindings="Desktop_Entry" access="read">
    </property>

    <property name="SupportedUriSchemes" type="as" tp:name-for-bindings="Supported_Uri_Schemes" access="read">
    </property>

    <property name="SupportedMimeTypes" type="as" tp:name-for-bindings="Supported_Mime_Types" access="read">
    </property>

  </interface>
</node>
`

export const MPRIS_TRACK_LIST_XML = `
<node name="/Track_List_Interface" xmlns:tp="http://telepathy.freedesktop.org/wiki/DbusSpec#extensions-v0">
  <interface name="org.mpris.MediaPlayer2.TrackList">

    <method name="GetTracksMetadata" tp:name-for-bindings="Get_Tracks_Metadata">
      <arg direction="in" name="TrackIds" type="ao" tp:type="Track_Id[]">
      </arg>
      <arg direction="out" type="aa{sv}" tp:type="Metadata_Map[]" name="Metadata">
      </arg>
    </method>

    <method name="AddTrack" tp:name-for-bindings="Add_Track">
      <arg direction="in" type="s" tp:type="Uri" name="Uri">
      </arg>
      <arg direction="in" type="o" tp:type="Track_Id" name="AfterTrack">
      </arg>
      <arg direction="in" type="b" name="SetAsCurrent">
      </arg>
    </method>

    <method name="RemoveTrack" tp:name-for-bindings="Remove__Track">
      <arg direction="in" type="o" tp:type="Track_Id" name="TrackId">
      </arg>
    </method>

    <method name="GoTo" tp:name-for-bindings="Go_To">
      <arg direction="in" type="o" tp:type="Track_Id" name="TrackId">
      </arg>
    </method>

    <property name="Tracks" type="ao" tp:type="Track_Id[]" tp:name-for-bindings="Tracks" access="read">
    </property>

    <property name="CanEditTracks" type="b" tp:name-for-bindings="Can_Edit_Tracks" access="read">
    </property>

    <signal name="TrackListReplaced" tp:name-for-bindings="Track_List_Replaced">
      <arg name="Tracks" type="ao" tp:type="Track_Id[]">
      </arg>
      <arg name="CurrentTrack" type="o" tp:type="Track_Id">
      </arg>
    </signal>

    <signal name="TrackAdded" tp:name-for-bindings="Track_Added">
      <arg type="a{sv}" tp:type="Metadata_Map" name="Metadata">
      </arg>
      <arg type="o" tp:type="Track_Id" name="AfterTrack">
      </arg>
    </signal>

    <signal name="TrackRemoved" tp:name-for-bindings="Track_Removed">
      <arg type="o" tp:type="Track_Id" name="TrackId">
      </arg>
    </signal>

    <signal name="TrackMetadataChanged" tp:name-for-bindings="Track_Metadata_Changed">
      <arg type="o" tp:type="Track_Id" name="TrackId">
      </arg>
      <arg type="a{sv}" tp:type="Metadata_Map" name="Metadata">
      </arg>
    </signal>
  </interface>
</node>

`